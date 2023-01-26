import { EventEmitter } from "../commons/event"
import { Component } from "../vue-integration/component"
import { EventsList, ValidatorsTree } from "./types"
import { ValidationGroup } from "./validation/validation-group"
import { ValidationNode } from "./validation/validation-node";

export type ValidationApi<T> = {
  $errors: string[]
  $error: boolean;
  $invalid: boolean;
  $valid: boolean;
  $isValid: boolean;
  $dirty: boolean;
  $pristine: boolean;
  $pending: boolean;
} & {
    [P in keyof T]: P extends "$each" ? ValidationApi<T[P]>[] : ValidationApi<T[P]>;
  }

function buildApi (node: ValidationNode) {
  const api: any = {
    get $errors () { return node.$errors },
    get $error () { return node.$error },
    get $invalid () { return node.$invalid },
    get $valid () { return node.$valid },
    get $isValid () { return node.$isValid },
    get $dirty () { return node.$dirty },
    get $pristine () { return node.$pristine },
    get $pending () { return node.$pending },

    set $dirty (value) { node.$dirty = value },
  }

  for (const child in node.children) {
    api[child] = buildApi(node.children[child])
  }

  return api
}

export class Fvm<T extends ValidatorsTree> {
  public rootNode!: ValidationGroup;
  public events: EventEmitter<EventsList>;

  constructor (private component: Component, public validators: T) {
    this.events = new EventEmitter();

  }

  buildValidationTree () {
    this.rootNode = new ValidationGroup(this.validators, '', this.component, this.events);
  }

  destroy () {
    this.rootNode.destroy();
  }

  getPublicApi (): ValidationApi<T> & { $events: EventEmitter<EventsList> } {
    const api = buildApi(this.rootNode)
    api.$events = this.events
    return api;
  }
}
