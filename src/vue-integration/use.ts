import { Fvm } from "../fvm/fvm";
import { ValidatorsTree } from "../fvm/types";
import * as Vue from "vue";
import { ValidationApi } from "../fvm/api";

function _useFvm<T extends ValidatorsTree> (): Vue.Ref<ValidationApi<any>>;
function _useFvm<T extends ValidatorsTree> (rules: T): Vue.Ref<ValidationApi<T>>;
function _useFvm<T extends ValidatorsTree> (state: Vue.UnwrapNestedRefs<any>, rules: T): Vue.Ref<ValidationApi<T>>;
function _useFvm<T extends ValidatorsTree> (arg1?: Vue.UnwrapNestedRefs<any> | T, arg2?: T): Vue.Ref<ValidationApi<T>> {

  const api: Vue.Ref<ValidationApi<T> | undefined> = Vue.ref(undefined);
  const apiProxy = {
    get: () => api.value,
    set: (value: ValidationApi<T>) => api.value = value
  }

  let fvm: Fvm<T>;

  if (arg1 && arg2) {
    //composition api
    fvm = new Fvm(null, arg1, arg2, apiProxy, Vue.watch);
    fvm.startValidation();
  } else {
    //options api
    const componentInstance = Vue.getCurrentInstance()?.proxy;
    if (!componentInstance) {
      throw new Error('useFvm must be called within a component instance');
    }

    if (arg1 && !arg2) {
      fvm = new Fvm(componentInstance, null, arg1, apiProxy);
    } else {
      fvm = new Fvm(componentInstance, null, componentInstance.$options.validations, apiProxy);
    }
    Vue.onBeforeMount(() => {
      fvm.startValidation();
    })
  }
  return api as any
}

const useFvm = (Vue.version.startsWith("2.") ? () => { } : _useFvm)

export {
  useFvm
}
