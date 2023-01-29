import { computed, ComputedRef, reactive, UnwrapNestedRefs } from "vue-demi";
// import { EventEmitter } from "../commons/event"
import { State } from "../validation/state";
import { ValidationNode } from "../validation/validation-node";
import { ValidatorsTree } from "./types";

export type ValidationApi<T> = {
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
    [P in keyof T]: P extends "$each" ? ValidationApi<T[P]>[] : ValidationApi<T[P]>;
  };

export class Fvm<T extends ValidatorsTree> {
  public rootNode!: ValidationNode<T>;
  private internalState: State;
  // public events: EventEmitter<EventsList>;

  constructor(private component: any | null, private state: any | null, public validators: T) {
    // this.events = new EventEmitter();
    this.internalState = new State(this.component, this.state);
  }

  buildValidationTree () {
    this.rootNode = new ValidationNode('', null, this.validators, this.internalState);
    this.rootNode.validate();
  }

  destroy () {
    this.rootNode.destroy();
  }

  // getPublicApi (): ValidationApi<T> & { $events: EventEmitter<EventsList> } {
  getPublicApi (): ValidationApi<T> {
    return this.rootNode.getApi();
  }
}
