import { computed, ComputedRef, reactive, UnwrapNestedRefs } from "vue-demi"
// import { EventEmitter } from "../commons/event"
import { State } from "../validation/state"
import { ValidationNode } from "../validation/validation-node"
import { Component } from "../vue-integration/component"
import { ValidatorsTree } from "./types"

export type ValidationApi<T> = {
  $errors: string[]
  $error: boolean;
  $invalid: boolean;
  $valid: boolean;
  $isValid: boolean;
  $dirty: boolean;
  $pristine: boolean;
  $pending: boolean;
  validate (): void;
} & {
    [P in keyof T]: P extends "$each" ? ValidationApi<T[P]>[] : ValidationApi<T[P]>;
  }

function buildApi<T> (node: ValidationNode<T>): ValidationApi<T> {
  const api: any = {
    get $errors () {
      const errors = node.getErrorsComputed().value;
      return errors === false ? [] : errors;
    },
    get $error () { return this.$errors !== false },
    get $invalid () { return this.$errors !== false },
    get $valid () { return this.$errors === false },
    get $isValid () { return this.$errors === false },

    get $dirty () { return node.getDirtyComputed().value },
    set $dirty (value) { node.setDirty(value) },
    get $pristine () { return this.$dirty === false },

    validate () { return node.validate() }
  }

  for (const child in node.children) {
    api[child] = buildApi(node.children[child])
  }

  return api
}

export class Fvm<T extends ValidatorsTree> {
  public rootNode!: ValidationNode<T>;
  // public events: EventEmitter<EventsList>;

  constructor (private component: any | null, private state: any | null, public validators: T) {
    // this.events = new EventEmitter();

  }

  private getState () {
    return this.state || this.component.$data || this.component.$options.data();
  }

  buildValidationTree () {
    const internalState = new State(this.component, this.getState())
    this.rootNode = new ValidationNode('', null, this.validators, internalState)
  }

  destroy () {
    this.rootNode.destroy();
  }

  // getPublicApi (): ValidationApi<T> & { $events: EventEmitter<EventsList> } {
  getPublicApi (): UnwrapNestedRefs<ValidationApi<T>> {
    return reactive(buildApi(this.rootNode))
  }
}
