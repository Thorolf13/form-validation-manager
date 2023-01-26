import { ExternalPromise } from '../../commons/promise';
import { AsyncValidator, HasErrorAsyncCallback, HasErrorCallbackReturn } from '../validator';


export default function async (callback: HasErrorAsyncCallback, debounceTime = 0) {
  let timeout: any;

  return new AsyncValidator('async', (value, context) => {
    if (debounceTime > 0) {
      const promise = new ExternalPromise<HasErrorCallbackReturn>();

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
      return callback.call(context.component, value, context)
    }

  });
}
