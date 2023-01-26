import { get } from "../commons/lodash";
import { watch, set, isVue2 } from "vue-demi";

export type WatchOptions = { deep?: boolean, immediate?: boolean }
export type WatchCallback = (oldValue: any, newValue: any) => void;
export type WatchStopHandle = () => void;

export class Component {

  isVue2 () {
    return !!this.componentInstance?.$watch;
  }

  getState () {
    return this.state || this.componentInstance.$data || this.componentInstance.$options.data();
  }

  getComponentInstance () {
    return this.componentInstance;
  }

  constructor (protected componentInstance: any, protected state: any) {
  }

  getPropertyByPath (path: string) {
    return get(this.getState(), path);
  }

  watch (path: string, callback: WatchCallback, options: WatchOptions): WatchStopHandle {
    if (this.componentInstance?.$watch) {
      return this.componentInstance.$watch(path, callback, options);
    } else {
      return watch(() => this.getPropertyByPath(path), callback, options);
    }

  }

  setProperty (key: string, value: any) {
    if (this.componentInstance.$set) {
      this.componentInstance.$set(key, value);
    } else {
      set(this.getState(), key, value)
    }
  }

  forceUpdate () {
    if (this.componentInstance?.$forceUpdate) {
      this.componentInstance.$forceUpdate();
    }
  }
}
