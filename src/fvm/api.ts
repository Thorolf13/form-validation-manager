import { ValidationNode } from "../validation/validation-node"
import { Validator } from "../validators/validator";


export type ValidationApi<T> = {
  $errors: string[];
  $error: boolean;
  $invalid: boolean;
  $valid: boolean;
  $isValid: boolean;
  $dirty: boolean;
  $pristine: boolean;
  $pending: boolean;

  setDirty (dirty?: boolean): void;
  validate (): void;
} & {
    [P in keyof T]: T[P] extends Validator ? ValidationApi<{}> : P extends "$each" ? ValidationApi<T[P]>[] : ValidationApi<T[P]>;
  };


function buildApi<T> (node: ValidationNode<T>): ValidationApi<T> {
  const api: any = {

    get $errors () {
      const errors = node.getErrors();
      return errors === false ? [] : errors;
    },

    get $error () { return node.getErrors() !== false; },
    get $invalid () { return node.getErrors() !== false; },
    get $valid () { return node.getErrors() === false; },
    get $isValid () { return node.getErrors() === false; },

    get $dirty () { return node.getDirty(); },
    get $pristine () { return !node.getDirty(); },


    get $pending () { return node.getPending(); },

    setDirty (value: boolean) { node.setDirty(value); },
    validate () { return node.validate(); }
  };

  for (const child in node.children) {
    api[child] = buildApi(node.children[child]);
  }

  return api;
}


export { buildApi }
