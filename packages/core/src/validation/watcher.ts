export type WatchFn = (fn: () => any, cb: (newValue: any, oldvalue: any) => void, options?: { deep?: boolean; immediate?: boolean; }) => () => void;

export class Watcher {
  constructor (
    private componentInstance: any,
    public path: string,
    private getValue: () => any,
    private callback: (newvalue: any, oldvalue: any) => void,
    private options: { deep?: boolean, immediate?: boolean },
    private watchFn?: WatchFn
  ) {
  }

  private unwatch: () => void = () => { };

  start () {
    if (this.componentInstance?.$watch) {
      this.unwatch = this.componentInstance.$watch(this.path, this.callback, this.options);
    } else if (this.watchFn) {
      this.unwatch = this.watchFn(() => this.getValue(), this.callback, this.options);
    } else {
      throw new Error('No component instance or watchFn provided');
    }
  }

  stop () {
    this.unwatch();
  }
}
