export interface PromiseState<T> {
  isRejected: () => Boolean;
  isFulFilled: () => Boolean;
  isPending: () => Boolean;
  getResponse: () => T | null;
  getError: () => any | null;
}

export class ExternalPromise<T>{
  public promise: Promise<T>;
  public resolve!: (value: T) => void;
  public reject!: (error: any) => void;


  constructor() {
    this.promise = new Promise<T>(($resolve, $reject) => {
      this.resolve = $resolve;
      this.reject = $reject;
    })
  }

  public then() {
    return this.promise.then
  }

  public catch() {
    return this.promise.catch
  }
}

export function wrapPromiseState<T, P extends Promise<T> | ExternalPromise<T>>(promise: P): P & PromiseState<T> {
  if ((promise as any).isPending) {
    return promise as any;
  }

  // Set initial state
  let isPending = true;
  let isRejected = false;
  let isFulfilled = false;
  let response: T | null = null;
  let error: any | null = null;

  let result: any = promise.then(
    function (v) {
      response = v;
      isFulfilled = true;
      isPending = false;
      return v;
    },
    function (e) {
      error = e;
      isRejected = true;
      isPending = false;
      throw e;
    }
  );
  result.isFulfilled = function () { return isFulfilled; };
  result.isPending = function () { return isPending; };
  result.isRejected = function () { return isRejected; };
  result.getResponse = function () { return response; };
  result.getError = function () { return error; };
  return result;
}