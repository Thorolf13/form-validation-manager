import { AsyncValidator, HasErrorAsyncCallback } from '../validator';

export default function async(callback: HasErrorAsyncCallback, forceRenderUpdateAuto = true) {
  return new AsyncValidator('async', (value, context) => {
    return callback.call(context.component, value, context)
      .then(v => {
        if (forceRenderUpdateAuto) {
          setTimeout(() => { context.component.$forceUpdate(); });
        }
        return v
      }, err => {
        if (forceRenderUpdateAuto) {
          setTimeout(() => { context.component.$forceUpdate(); });
        }
        throw err;
      });
  });
}
