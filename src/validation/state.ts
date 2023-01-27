import { Errors } from "../validators/validator";
import { ref, Ref, watch } from "vue-demi";
import { ValidationNode } from "./validation-node";
import { get } from "../commons/lodash";


type _Errors = Errors | '__pending__';

export class State {

  validationNodes: Record<string, ValidationNode<any>> = {};
  errors: Record<string, Ref<_Errors>> = {};
  dirty: Record<string, Ref<boolean>> = {};

  constructor (public componentInstance: any, private componentState: any) {
  }

  registerValidationNode (path: string, validationNode: ValidationNode<any>) {
    this.validationNodes[path] = validationNode;
    this.errors[path] = ref(false);
    this.dirty[path] = ref(false);
  }

  unregisterValidationNode (path: string) {
    delete this.validationNodes[path];
    delete this.errors[path];
    delete this.dirty[path];
  }

  setErrors (path: string, errors: _Errors) {
    this.errors[path].value = errors;
  }

  getErrors (path: string) {
    return this.errors[path].value;
  }

  setDirty (path: string, dirty: boolean = true) {
    this.dirty[path].value = dirty;
  }

  isDirty (path: string) {
    return this.dirty[path].value;
  }

  getValidationNode (path: string) {
    return this.validationNodes[path];
  }

  getPropertyValue (path: string) {
    const state = this.componentState || this.componentInstance.$data || this.componentInstance.$options.data();

    return get(state, path);
  }

  watch (path: string, callback: (oldValue: any, newValue: any) => void, options: { deep?: boolean, immediate?: boolean }) {
    if (this.componentInstance?.$watch) {
      return this.componentInstance.$watch(path, callback, options);
    } else {
      return watch(() => this.getPropertyValue(path), callback, options);
    }
  }
}
