import andSequence from '../logic/and_sequence';
import { Validator } from '../validator';
import isString from './is-string';

export default function includes (str: string) {
  return Validator.fromSubValidators('includes',
    andSequence(
      isString(),
      new Validator('includes', value => !~value.indexOf(str))
    )
  );
}
