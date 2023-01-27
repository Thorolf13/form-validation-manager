import { Context, Indexes, Validator } from "../validators/validator";
import { ValidatorTree } from "../validators/validator-tree";
import { State } from "./state";
import { isPromise } from "../commons/promise";
import { computed, ComputedRef } from "vue-demi";

export class ValidationNode<T extends ValidatorTree<T>> {
  public children: { [K in keyof T]: K extends '$each' ? ValidationNode<T[K][]> : ValidationNode<T[K]> };
  public validator?: Validator;
  public isFinalNode = false;


  constructor (public path: string, public parent: ValidationNode<any> | null, public validators: T, private state: State) {
    this.path = path = path.replace(/^\./, '');
    state.registerValidationNode(path, this);

    this.children = {} as any;
    this.init();

    this.validate();
  }

  private init () {
    if (this.validators instanceof Validator) {
      this.validator = this.validators as any;
      this.isFinalNode = true;

      this.state.watch(this.getValuePath(), () => { this.setDirty(true); this.validate(); }, { deep: true });
    } else {
      for (const key in this.validators) {
        if (key === '$each') {
          this.state.watch(this.getValuePath(), () => {
            try { (this.children as any)[key].destroy(); } catch (e) { }
            const node: ValidationNode<any> = this.each(this.validators[key] as any);
            (this.children as any)[key] = node as any;
          }, { deep: true, immediate: true })
        } else {
          const validator = this.validators[key] as ValidatorTree<any>;
          const childPath = /\$each$/.test(this.path) ? this.path + '[' + key + ']' : this.path + '.' + key;
          (this.children as any)[key] = new ValidationNode(childPath, this, validator, this.state);
        }
      }
    }
  }

  private each (validators: Validator | ValidatorTree<any>): ValidationNode<any> {
    const subValidators: any = {};

    this.getValue().value.forEach((item: any, index: number) => {
      subValidators[index] = validators;
    })

    return new ValidationNode(this.path + '.$each', this, subValidators, this.state);
  }

  private getValuePath () {
    return this.path.replace(/^\./, '').replace(/\.\$self/g, '').replace(/\.\$each/g, '');
  }

  private getValue (): ComputedRef<any> {
    return computed(() => {
      return this.state.getPropertyValue(this.getValuePath());
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

  private getContext (): Context {
    const value = this.getValue().value;
    const indexes = this.parseIndexes(this.path);
    return { component: this.state.componentInstance, path: this.path, value, indexes, parent: this.parent?.getContext() };
  }

  validate () {
    if (this.validator) {
      const validation = this.validator.hasError(this.getValue().value, this.getContext());

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
        child.validate();
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

  getDirtyComputed () {
    if (this.isFinalNode) {
      return computed(() => {
        return this.state.isDirty(this.path);
      });
    } else {
      return computed(() => {
        for (const key in this.children) {
          const child = this.children[key];
          if (child.getDirtyComputed().value) {
            return true;
          }
        }
        return false;
      });
    }
  }

  setDirty (value: boolean) {
    if (this.isFinalNode) {
      this.state.setDirty(this.path, value);
    } else {
      for (const key in this.children) {
        const child = this.children[key];
        child.setDirty(value);
      }
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
