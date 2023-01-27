import { Errors } from "../validators/validator";
import { ref, Ref } from "vue-demi";
import { ValidationNode } from "./validation-node";


type _Errors = Errors | '__pending__';

export class State {

  validationNodes: Record<string, ValidationNode<any>> = {};
  errors: Record<string, Ref<_Errors>> = {};

  constructor() {
  }

  registerValidationNode (path: string, validationNode: ValidationNode<any>) {
    this.validationNodes[path] = validationNode;
    this.errors[path] = ref(false);
  }

  unregisterValidationNode (path: string) {
    delete this.validationNodes[path];
    delete this.errors[path];
  }

  setErrors (path: string, errors: _Errors) {
    this.errors[path].value = errors;
  }

  getErrors (path: string) {
    return this.errors[path].value;
  }

  getValidationNode (path: string) {
    return this.validationNodes[path];
  }
}