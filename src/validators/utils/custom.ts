import { Validator, HasErrorCallback } from '../validator';

export default function custom(callback: HasErrorCallback) {
  return new Validator('custom', (value, context) => {
    return callback.call(context.component, value, context);
  });
}
