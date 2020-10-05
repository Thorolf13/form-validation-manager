type Listener = (...args: any[]) => void

export class EventEmitter<T extends string> {
  private readonly events: { [event: string]: Listener[] } = {};

  constructor() {
  }

  public on(event: T, listener: Listener): () => void {
    if (typeof this.events[event] !== 'object') this.events[event] = [];

    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  public off(event: T, listener: Listener): void {
    if (typeof this.events[event] !== 'object') return;

    const idx: number = this.events[event].indexOf(listener);
    if (idx > -1) this.events[event].splice(idx, 1);
  }

  public removeAll(): void {
    Object.keys(this.events).forEach((event: string) =>
      this.events[event].splice(0, this.events[event].length)
    );
  }

  public emit(event: T, ...args: any[]): void {
    if (typeof this.events[event] !== 'object') return;

    this.events[event].forEach(listener => listener.apply(this, args));
  }

  public once(event: T, listener: Listener): void {
    const remove: (() => void) = this.on(event, (...args: any[]) => {
      remove();
      listener.apply(this, args);
    });
  }
}