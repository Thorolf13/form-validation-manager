import { ExternalPromise } from 'fvm-commons';
import { Validator, Component, Context } from '../validator';


export default function async (callback: ((this: Component, value: any, context: Context) => Promise<boolean | string | (boolean | string)[]>), debounceTime = 0) {
  let timeout: any;

  return new Validator('async', (value, context) => {
    if (debounceTime > 0) {
      const promise = new ExternalPromise<boolean | string | (boolean | string)[]>();

      const func = () => callback.call(context.component, value, context)
        .then(promise.resolve)
        .catch(promise.catch);

      const later = () => {
        clearTimeout(timeout);
        func();
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, debounceTime);

      return promise.promise;
    } else {
      return callback.call(context.component, value, context);
    }

  });
}
