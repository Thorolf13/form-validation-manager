import { Fvm } from "../fvm/fvm";
import { ValidatorsTree } from "../fvm/types";
import { UnwrapNestedRefs, reactive, ref, Ref } from "vue-demi";
import { ValidationApi } from "../fvm/api";

export function useFvm<T extends ValidatorsTree> (state: UnwrapNestedRefs<any>, rules: T): Ref<ValidationApi<T>> {


  // const api: { data: ValidationApi<T> | undefined } = reactive({ data: undefined })
  const api: Ref<ValidationApi<T> | undefined> = ref(undefined);
  const apiProxy = {
    get: () => api.value,
    set: (value: ValidationApi<T>) => api.value = value
  }

  const fvm = new Fvm(null, state, rules, apiProxy);
  fvm.startValidation();

  return api as any;
}
