import and_sequence from './logic/and_sequence';
import required from './required';
import numeric from './numeric';

export default function gte(min: number) {
  return new Validator('gte', (value, context) => {
    return and_sequence(
      required(),
      numeric(),
      new Validator('gte', value => !(value >= min))
    ).hasError(value, context);
  });
}
