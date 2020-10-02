import { AsyncValidator, HasErrorAsyncCallback } from '../validator';

export default function async(callback: HasErrorAsyncCallback) {
  return new AsyncValidator('async', (value, context) => {
    return callback.call(context.component, value, context);
  });
}
