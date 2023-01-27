import { Context, Validator } from "../validators/validator";
import { ValidatorTree } from "../validators/validator-tree";
import { State } from "./state";
import { isPromise } from "../commons/promise";
import { computed, ComputedRef } from "vue-demi";

export class ValidationNode<T extends ValidatorTree<T>> {
  public children?: { [K in keyof T]: ValidationNode<T[K]> };
  public validator?: Validator;
  public isFinalNode = false;


  constructor(public path: string, public parent: ValidationNode<any> | null, public validators: T, private state: State) {
    state.registerValidationNode(path, this);

    if (validators instanceof Validator) {
      this.validator = validators as any;
      this.isFinalNode = true;
    } else {
      const children: any = {};
      for (const key in validators) {
        // todo $each, $self
        const validator = validators[key] as ValidatorTree<any>;
        children[key] = new ValidationNode(path + '.' + key, this, validator, state);
      }
      this.children = children as any;
    }
  }

  private getValue (): ComputedRef<any> {
    return computed(() => {

      return null;
    });
  }

  protected parseIndexes (path: string) {
    const indexes: Indexes = { length: 0 };
    const reg = /(\w+)\[(\d+)\]/g;

    let match;
    while (match = reg.exec(path)) {
      indexes[indexes.length + ''] = +match[2];
      indexes[match[1]] = +match[2];

      indexes.length++;
    }

    return indexes.length ? indexes : undefined;
  }

  private buildContext (): Context {
    const value = this.getValueByPath(this.path);
    const indexes = this.parseIndexes(this.path);
    return { path: this.path, value, indexes, parent: this.parent?.getContext() };
  }

  validate () {
    if (this.validator) {
      const validation = this.validator.hasError(this.getValue(), this.buildContext());

      if (isPromise(validation)) {
        this.state.setErrors(this.path, '__pending__');
        validation.then(errors => {
          this.state.setErrors(this.path, errors);
        }).catch(err => {
          console.error(err);
          this.state.setErrors(this.path, ['async validation error']);
        });
      } else {
        this.state.setErrors(this.path, validation);
      }
    } else {
      for (const key in this.children) {
        const child = this.children[key];
        child.validate(value[key], context);
      }
    }
  }

  getErrorsComputed () {
    if (this.isFinalNode) {
      return computed(() => {
        const errors = this.state.getErrors(this.path);
        if (errors === '__pending__') {
          return false;
        }
        return errors;
      });
    } else {
      return computed(() => {
        const errors: string[] = [];
        for (const key in this.children) {
          const child = this.children[key];
          const childErrors = child.getErrorsComputed().value;
          if (childErrors) {
            if (Array.isArray(childErrors)) {
              errors.push(...childErrors);
            } else {
              errors.push(childErrors);
            }
          }
        }
        return errors.length > 0 ? errors : false;
      });
    }
  }

  getPendingComputed () {
    if (this.isFinalNode) {
      return computed(() => {
        const errors = this.state.getErrors(this.path);
        return errors === '__pending__';
      });
    } else {
      return computed(() => {
        for (const key in this.children) {
          const child = this.children[key];
          if (child.getPendingComputed().value) {
            return true;
          }
        }
        return false;
      });

    }
  }

  destroy () {
    this.state.unregisterValidationNode(this.path);
    if (this.children) {
      for (const key in this.children) {
        const child = this.children[key];
        child.destroy();
      }
    }
  }
}