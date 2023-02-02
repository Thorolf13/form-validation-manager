import { State } from "../../src/validation/state";

export class StateMock extends State {

  constructor (state: any) {
    super(null, state, () => { });
    this.isRunning = true;
  }

  public __watchers: any = {}

  watch (path: string, callback: (oldValue: any, newValue: any) => void, options: { deep?: boolean | undefined; immediate?: boolean | undefined; }) {
    this.__watchers[path] = callback;

    if (options.immediate) {
      this.triggerWatch(path, undefined, this.getPropertyValue(path));
    }
  }

  triggerWatch (path: string, newValue: any, oldValue: any,) {
    this.__watchers[path](newValue, oldValue);
  }
}
