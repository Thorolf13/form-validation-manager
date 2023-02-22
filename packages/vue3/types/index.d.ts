import { UnwrapNestedRefs } from "vue";
import { ValidatorsTree } from "fvm-validators";

type ValidationApi<V> = {
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
    [P in Exclude<keyof V, '$fvm'>]: P extends "$each" ? ValidationApi<V[P]>[] : ValidationApi<V[P]>;
  };

export function useFvm (): ValidationApi<any>;
export function useFvm<T extends ValidatorsTree> (rules: T): ValidationApi<T>;
export function useFvm<T extends ValidatorsTree> (state: UnwrapNestedRefs<any>, rules: T): ValidationApi<T>;
