import { State } from "../validation/state";
import { ValidationNode } from "../validation/validation-node";
import { WatchFn } from "../validation/watcher";
import { buildApi, ValidationApi } from "./api";
import { ValidatorsTree } from "./types";

export type ApiProxy<T> = {
  get: () => ValidationApi<T> | undefined;
  set: (value: ValidationApi<T>) => void;
}


export class Fvm<T extends ValidatorsTree> {
  public rootNode!: ValidationNode<T>;
  private internalState: State;
  // public events: EventEmitter<EventsList>;

  private isRunning = false;

  constructor (private component: any | null, private state: any | null, public validators: T, private apiProxy: ApiProxy<T>, watchFn?: WatchFn) {
    // this.events = new EventEmitter();
    this.internalState = new State(this.component, this.state, () => {
      if (this.isRunning) {
        this.buildApi()
      }
    }, watchFn);
    this.rootNode = new ValidationNode('', null, this.validators, this.internalState);

    this.buildApi();
  }

  private buildApi () {
    const api = buildApi(this.rootNode);
    this.apiProxy.set(api);
  }

  destroy () {
    this.isRunning = false;
    this.internalState.stopWatching();
    this.rootNode.destroy();
  }

  startValidation () {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.internalState.startWatching();
    this.rootNode.validate();
  }
}
