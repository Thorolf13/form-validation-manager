import and_sequence from './logic/and_sequence';
import required from './required';
import numeric from './numeric';
import { Validator } from './validator';

export default function gt(min: number) {
  return new Validator('gt', (value, context) => {
    return and_sequence(
      required(),
      numeric(),
      new Validator('gt', value => !(value > min))
    ).hasError(value, context);
  });
}
