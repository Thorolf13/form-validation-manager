import { Fvm } from "../fvm/fvm";
import { ValidatorsTree } from "../fvm/types";
import { UnwrapNestedRefs, reactive, computed } from "vue-demi";
import { Component } from "./component";

export function useFvm<T extends ValidatorsTree> (rules: T, state: UnwrapNestedRefs<any>) {
  const component = new Component(null, state);
  const fvm = new Fvm(component, rules);
  fvm.buildValidationTree();

  return computed(() => fvm.getPublicApi());
}
