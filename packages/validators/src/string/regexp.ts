import andSequence from '../logic/and_sequence';
import { Validator } from '../validator';
import isString from './is-string';

export default function regexp (regexp: RegExp) {
  return Validator.fromSubValidators('regexp',
    andSequence(
      isString(),
      new Validator('regexp', value => !regexp.test(value))
    )
  );
}
