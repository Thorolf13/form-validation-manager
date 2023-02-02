import { watch } from "vue-demi";

export class Watcher {
  constructor (
    private componentInstance: any,
    public path: string,
    private getValue: () => any,
    private callback: (newvalue: any, oldvalue: any) => void,
    private options: { deep?: boolean, immediate?: boolean }
  ) {
  }

  private unwatch: () => void = () => { };

  start () {
    if (this.componentInstance?.$watch) {
      this.unwatch = this.componentInstance.$watch(this.path, this.callback, this.options);
    } else {
      this.unwatch = watch(() => this.getValue(), this.callback, this.options);
    }
  }

  stop () {
    this.unwatch();
  }
}
