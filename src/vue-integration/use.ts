import { Fvm } from "../fvm/fvm";
import { ValidatorsTree } from "../fvm/types";
import { UnwrapNestedRefs, reactive, computed } from "vue-demi";

export function useFvm<T extends ValidatorsTree> (rules: T, state: UnwrapNestedRefs<any>) {

  const fvm = new Fvm(null, state, rules);
  fvm.buildValidationTree();

  return computed(() => fvm.getPublicApi());
}
