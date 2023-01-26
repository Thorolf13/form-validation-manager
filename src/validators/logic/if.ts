import { Validator, Context, Component } from '../validator';

export default function _if (condition: (this: Component, value: any, context: Context) => boolean, thenValidator: Validator, elseValidator?: Validator) {
  return new Validator('if', (value, context) => {
    const test = condition.call(context.component, value, context);

    if (test) {
      return thenValidator.hasError(value, context);
    } else {
      if (elseValidator) {
        return elseValidator.hasError(value, context);
      } else {
        return false;
      }
    }
  });
}
