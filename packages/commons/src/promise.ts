export function isPromise (value: any): value is Promise<any> {
  return value && typeof value.then === 'function' && typeof value.catch === 'function';
}

export interface PromiseState<T> {
  isRejected: () => Boolean;
  isFulFilled: () => Boolean;
  isPending: () => Boolean;
  getResponse: () => T | null;
  getError: () => any | null;
}

export class ExternalPromise<T> {
  public promise: Promise<T>;
  public resolve!: (value: T) => void;
  public reject!: (error: any) => void;


  constructor () {
    this.promise = new Promise<T>(($resolve, $reject) => {
      this.resolve = $resolve;
      this.reject = $reject;
    });
  }

  public then () {
    return this.promise.then;
  }

  public catch () {
    return this.promise.catch;
  }
}
