import { Fvm } from "../fvm/fvm";
import { ValidatorsTree } from "../fvm/types";
import { UnwrapNestedRefs, ref, Ref, getCurrentInstance, onBeforeMount } from "vue-demi";
import { ValidationApi } from "../fvm/api";

function useFvm<T extends ValidatorsTree> (): Ref<ValidationApi<any>>;
function useFvm<T extends ValidatorsTree> (rules: T): Ref<ValidationApi<T>>;
function useFvm<T extends ValidatorsTree> (state: UnwrapNestedRefs<any>, rules: T): Ref<ValidationApi<T>>;
function useFvm<T extends ValidatorsTree> (arg1?: UnwrapNestedRefs<any> | T, arg2?: T): Ref<ValidationApi<T>> {

  const api: Ref<ValidationApi<T> | undefined> = ref(undefined);
  const apiProxy = {
    get: () => api.value,
    set: (value: ValidationApi<T>) => api.value = value
  }

  let fvm: Fvm<T>;

  if (arg1 && arg2) {
    //composition api
    fvm = new Fvm(null, arg1, arg2, apiProxy);
    fvm.startValidation();
  } else {
    //options api
    const componentInstance = getCurrentInstance()?.proxy;
    if (!componentInstance) {
      throw new Error('useFvm must be called within a component instance');
    }

    if (arg1 && !arg2) {
      fvm = new Fvm(componentInstance, null, arg1, apiProxy);
    } else {
      fvm = new Fvm(componentInstance, null, componentInstance.$options.validations, apiProxy);
    }
    onBeforeMount(() => {
      fvm.startValidation();
    })
  }
  return api as any
}


export {
  useFvm
}
