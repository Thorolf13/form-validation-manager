import { AsyncValidator, HasErrorAsyncCallback, Context, HasErrorCallbackReturn } from '../validator';
import { ExternalPromise } from '../../fvm/promise';

function callValidation(value: any, context: Context, callback: HasErrorAsyncCallback, forceRenderUpdateAuto: boolean) {
  return callback.call(context.component, value, context)
    .then(v => {
      if (forceRenderUpdateAuto) {
        setTimeout(() => { context.component.$forceUpdate(); });
      }
      return v;
    }, err => {
      if (forceRenderUpdateAuto) {
        setTimeout(() => { context.component.$forceUpdate(); });
      }
      throw err;
    });
}

export default function async(callback: HasErrorAsyncCallback, forceRenderUpdateAuto = true, debounceTime = 0) {
  let timeout: number;

  return new AsyncValidator('async', (value, context) => {
    if (debounceTime > 0) {
      const promise = new ExternalPromise<HasErrorCallbackReturn>();

      const func = () => callValidation(value, context, callback, forceRenderUpdateAuto)
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
      return callValidation(value, context, callback, forceRenderUpdateAuto)
    }

  });
}
