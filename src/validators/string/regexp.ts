import { Validator } from '../validator';
import { andSequence } from '../..';
import isString from './is-string';

export default function regexp(regexp: RegExp) {
  return new Validator('regexp', (value, context) => {
    return andSequence(
      isString(),
      new Validator('regexp', value => !regexp.test(value))
    ).hasError(value, context);
  });
}
