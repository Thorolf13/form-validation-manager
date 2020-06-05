import and_sequence from './logic/and_sequence';
import required from './required';
import numeric from './numeric';

export default function lt(max: number) {
  return new Validator('lt', (value, context) => {
    return and_sequence(
      required(),
      numeric(),
      new Validator('lt', value => !(value < max))
    ).hasError(value, context);
  });
}
