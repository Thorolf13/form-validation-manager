import { Context, Indexes, Validator } from "../validators/validator";
import { ValidatorTree } from "../validators/validator-tree";
import { State } from "./state";
import { isPromise } from "../commons/promise";
import { ValidationApi } from "../fvm/fvm";

export class ValidationNode<T extends ValidatorTree<T>> {
  public children: { [K in keyof T]: K extends '$each' ? ValidationNode<T[K][]> : ValidationNode<T[K]> };
  public validator?: Validator;
  public isFinalNode = false;
  private unwatch = () => { };


  constructor (public path: string, public parent: ValidationNode<any> | null, public validators: T, private state: State) {
    this.path = path = path.replace(/^\./, '');

    state.registerValidationNode(path, this);

    this.children = {} as any;
    this.init();
  }

  private init () {
    if (this.validators instanceof Validator) {
      this.validator = this.validators as any;
      this.isFinalNode = true;

      this.state.watch(this.getPropertyPath(), () => { this.setDirty(true); this.validate(); }, { deep: true });
    } else {
      for (const key in this.validators) {
        if (key === '$each') {
          this.buildEachChildren();
          this.state.watch(this.getPropertyPath() + '.length', () => { this.buildEachChildren(true); }, { deep: true });
        } else {
          const validator = this.validators[key] as ValidatorTree<any>;
          const childPath = /\$each$/.test(this.path) ? this.path + '[' + key + ']' : this.path + '.' + key;
          (this.children as any)[key] = new ValidationNode(childPath, this, validator, this.state);
        }
      }
    }
  }

  private buildEachChildren (validate = false) {
    try { (this.children as any)['$each'].destroy(); } catch (e) { }
    const node: ValidationNode<any> = this.each((this.validators as any)['$each']);
    (this.children as any)['$each'] = node as any;
  }

  private each (validators: Validator | ValidatorTree<any>): ValidationNode<any> {
    const subValidators: any = {};

    this.getValue().forEach((item: any, index: number) => {
      subValidators[index] = validators;
    });

    return new ValidationNode(this.path + '.$each', this, subValidators, this.state);
  }

  getPropertyPath (): string {
    return this.path.replace(/^\./, '').replace(/\.\$self/g, '').replace(/\.\$each/g, '');
  }

  private getValue (): any {
    return this.state.getPropertyValue(this.getPropertyPath());
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
    const value = this.getValue();
    const indexes = this.parseIndexes(this.path);
    return { component: this.state.componentInstance, path: this.path, value, indexes, parent: this.parent?.getContext() };
  }

  validate () {
    if (this.validator) {
      const validation = this.validator.hasError(this.getValue(), this.getContext());

      if (this.validator?.name === 'revalidate') {

        if (validation === false) {
          return;
        }

        const paths: string[] = (Array.isArray(validation) ? validation : [validation]) as any;

        paths.forEach(path => {
          const node = this.state.getValidationNode(path);
          if (node) {
            node.validate();
          } else {
            console.error('trying to revalidate ' + path + ' : no validator found');
          }
        });
        return;
      }

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

  getErrors () {
    if (this.isFinalNode) {
      const errors = this.state.getErrors(this.path);
      if (errors === '__pending__') {
        return false;
      }
      return errors;
    } else {
      const errors: string[] = [];
      for (const key in this.children) {
        const child = this.children[key];
        const childErrors = child.getErrors();
        if (childErrors) {
          if (Array.isArray(childErrors)) {
            errors.push(...childErrors);
          } else {
            errors.push(childErrors);
          }
        }
      }
      return errors.length > 0 ? errors : false;
    }
  }

  getPending () {
    if (this.isFinalNode) {
      return this.state.getErrors(this.path) === '__pending__';
    } else {
      for (const key in this.children) {
        const child = this.children[key];
        if (child.getPending()) {
          return true;
        }
      }
      return false;
    }
  }

  getDirty () {
    if (this.isFinalNode) {
      return this.state.isDirty(this.path);
    } else {
      for (const key in this.children) {
        const child = this.children[key];
        if (child.getDirty()) {
          return true;
        }
      }
      return false;
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
    if (this.children) {
      for (const key in this.children) {
        const child = this.children[key];
        child.destroy();
        delete (this.children as any)[key];
      }
    }

    this.state.unregisterValidationNode(this.path);
    this.unwatch();
  }

  getApi (): ValidationApi<T> {
    const node = this;
    const api: any = {
      get $errors () {
        const errors = node.getErrors();
        return errors === false ? [] : errors;
      },

      get $error () { return node.getErrors() !== false; },
      get $invalid () { return node.getErrors() !== false; },
      get $valid () { return !node.getErrors() === false; },
      get $isValid () { return !node.getErrors() === false; },

      get $dirty () { return node.getDirty(); },
      set $dirty (value: boolean) { node.setDirty(value); },
      get $pristine () { return !node.getDirty(); },


      get $pending () { return node.getPending(); },

      validate () { return node.validate(); }
    };

    for (const child in node.children) {
      api[child] = node.children[child].getApi();
    }

    return api;
  }

}
