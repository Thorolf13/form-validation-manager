import { Validator } from '../validator';
import { andSequence } from '../..';
import isString from './is-string';

export default function includes(str: string) {
  return new Validator('includes', (value, context) => {
    return andSequence(
      isString(),
      new Validator('includes', value => !~value.indexOf(str))
    ).hasError(value, context);
  });
}
