import { ValidationApi, ValidatorTree } from './index';
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
    validations?: ValidatorTree;
  }
}
