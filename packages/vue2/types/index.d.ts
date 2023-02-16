export type ValidationApi<V> = {
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

export type PluginObject<T> = {
  install: (Vue: any, options: T) => void;
};

export const Fvm: PluginObject<void>;
export const FormvalidationManager: PluginObject<void>;

import { ValidatorsTree } from 'fvm-validators';
import { DefaultData, DefaultMethods, DefaultComputed, PropsDefinition, DefaultProps, ComponentOptions } from 'vue2/types/options';
import Vue from 'vue2';


declare module 'vue/types/vue' {
  interface Vue {
    $fvm: ValidationApi<any>;
  }
}

declare module 'vue/types/options' {

  interface ComponentOptions<
    V extends Vue,
    Data = DefaultData<V>,
    Methods = DefaultMethods<V>,
    Computed = DefaultComputed,
    PropsDef = PropsDefinition<DefaultProps>,
    Props = DefaultProps> {
    validations?: ValidatorsTree;
  }
}
