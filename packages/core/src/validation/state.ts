
import { ValidationNode } from "./validation-node";
import { get } from "fvm-commons";
import { Watcher, WatchFn } from "./watcher";


type _Errors = false | string[] | '__pending__';


export class State {

  validationNodes: Record<string, ValidationNode<any>> = {};
  errors: Record<string, _Errors> = {};
  dirty: Record<string, boolean> = {};

  protected isRunning = false;

  constructor (public componentInstance: any, private componentState: any, private onUpdate: () => void, private watchFn?: WatchFn) {
  }

  registerValidationNode (path: string, validationNode: ValidationNode<any>) {
    this.validationNodes[path] = validationNode;
    this.errors[path] = (false);
    this.dirty[path] = (false);

    this.onUpdate();
  }

  unregisterValidationNode (path: string) {
    delete this.validationNodes[path];
    delete this.errors[path];
    delete this.dirty[path];

    this.onUpdate();
  }

  setErrors (path: string, errors: _Errors) {
    if (this.errors[path] === undefined) {
      throw new Error(`Cannot set errors for path ${path} because it is not registered`);
    }

    const oldValue = this.errors[path];
    this.errors[path] = errors;

    this.onUpdate();
  }

  getErrors (path: string) {
    if (this.errors[path] === undefined) {
      throw new Error(`Cannot get errors for path ${path} because it is not registered`);
    }
    return this.errors[path];
  }

  setDirty (path: string, dirty: boolean = true) {
    const oldValue = this.dirty[path];
    this.dirty[path] = dirty;

    if (oldValue !== dirty) {
      this.onUpdate();
    }
  }

  isDirty (path: string) {
    return this.dirty[path];
  }

  getValidationNode (path: string) {
    return this.validationNodes[path];
  }

  getPropertyValue (propertyPath: string) {
    if (this.isRunning === false) {
      return;
    }

    const state = this.componentState || this.componentInstance.$data || this.componentInstance.$options.data();


    const value = get(state, propertyPath);
    return value;
  }


  private watchers: Watcher[] = [];

  watch (propertyPath: string, callback: (newValue: any, oldValue: any) => void, options: { deep?: boolean, immediate?: boolean; }) {
    this.watchers.push(
      new Watcher(this.componentInstance, propertyPath, () => this.getPropertyValue(propertyPath), callback, options, this.watchFn)
    )
  }

  unwatch (propertyPath: string) {
    this.watchers.find(w => w.path === propertyPath)?.stop();
  }

  startWatching () {
    this.isRunning = true;
    this.watchers.forEach(w => w.start());
  }

  stopWatching () {
    this.isRunning = false;
    this.watchers.forEach(w => w.stop());
  }
}
