import { Component } from "./types";

type Options = { deep?: boolean, immediate?: boolean }

class Watcher_ {
  constructor(public unwatch: () => void, public callback: (oldvalue: any, newValue: any) => void) { }
}

export class Watcher {

  private watchers: { [x: string]: Watcher_ } = {};

  constructor(private componentInstance: Component) { }

  unwatchAll() {
    for (const key in this.watchers) {
      this.unwatch(key);
    }
  }

  unwatch(key: string) {
    this.watchers[key].unwatch();
    delete this.watchers[key];
  }

  watch(key: string, callback: (oldvalue: any, newValue: any) => void, options: Options) {
    key = key.replace(/\[(\d+)\]/g, (_, a) => '.' + a)

    if (this.watchers[key]) {
      this.unwatch(key);
    }
    const unwatch = this.componentInstance.$watch(key, (o: any, n: any) => {
      callback(o, n);
      this.componentInstance.$forceUpdate();
    }, options);

    this.watchers[key] = new Watcher_(unwatch, callback);
  }

  get(key: string) {
    return this.watchers[key];
  }

}
