import and_sequence from './logic/and_sequence';
import required from './required';
import numeric from './numeric';
import { Validator } from './validator';

export default function lte(max: number) {
  return new Validator('lte', (value, context) => {
    return and_sequence(
      required(),
      numeric(),
      new Validator('lte', value => !(value <= max))
    ).hasError(value, context);
  });
}
