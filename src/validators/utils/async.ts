import { ExternalPromise } from '../../commons/promise';
import { Validator, HasErrorAsyncCallback, HasErrorCallbackReturn } from '../validator';


export default function async (callback: HasErrorAsyncCallback, debounceTime = 0) {
  let timeout: any;

  return new Validator('async', (value, context) => {
    const $self = this;
    if (debounceTime > 0) {
      const promise = new ExternalPromise<HasErrorCallbackReturn>();

      const func = () => callback.call($self, value, context)
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
      return callback.call($self, value, context);
    }

  });
}
