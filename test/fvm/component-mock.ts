import { Component, WatchCallback, WatchOptions, WatchStopHandle } from "../../src/vue-integration/component";

export class ComponentMock extends Component {

  constructor (state: any) {
    super(null, state)
  }


  get data () { return this.state };


  private watchers: {
    [x: string]: WatchCallback
  } = {};


  watch (path: string, callback: WatchCallback, options: WatchOptions): WatchStopHandle {

    // return watch(() => this.getPropertyByPath(path), callback, options);
    this.watchers[path] = callback;
    if (options.immediate) {
      callback(undefined, this.getPropertyByPath(path))
    }
    return () => { }
  }

  setByPath (path: string, value: any) {
    const oldValue = this.getPropertyByPath(path);
    this.setProperty(path, value);
    if (this.watchers[path]) {
      this.watchers[path](oldValue, value);

    }
  }
}
