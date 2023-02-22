import { ValidationNode } from "../validation/validation-node"
import { Validator } from "fvm-validators";


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
  return proxyfyWithDefaultValues(_buildApi(node));
}

function _buildApi<T> (node: ValidationNode<T>): ValidationApi<T> {
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
    api[child] = _buildApi(node.children[child]);
  }

  return api;
}

function recursiveProxifyWithDefaultValues<T extends {}> (obj: T, dontProxify: string[], defaultValue: any): T {
  const proxifiedChildren: any = {};
  for (const key in obj) {
    if (!dontProxify.includes(key)) {
      proxifiedChildren[key] = recursiveProxifyWithDefaultValues((obj as any)[key], dontProxify, defaultValue);
    }
  }

  const handler = {
    get (target: any, prop: string) {
      if (dontProxify.includes(prop)) {
        return target[prop];
      } else {
        if (proxifiedChildren[prop]) {
          return proxifiedChildren[prop];
        } else {
          return recursiveProxifyWithDefaultValues(Object.assign({}, defaultValue) /* make a copy */, dontProxify, defaultValue);
        }
      }
    }

  };

  return new Proxy(obj, handler);
}


function proxyfyWithDefaultValues<T> (api: ValidationApi<T>): ValidationApi<T> {
  return recursiveProxifyWithDefaultValues(
    api,
    ['$errors', '$error', '$invalid', '$valid', '$isValid', '$dirty', '$pristine', '$pending', 'setDirty', 'validate'],
    {
      $errors: [],
      $error: null,
      $invalid: null,
      $valid: null,
      $isValid: null,
      $dirty: null,
      $pristine: null,
      $pending: null,
      setDirty: () => { },
      validate: () => { }
    }
  );
}



export { buildApi }
