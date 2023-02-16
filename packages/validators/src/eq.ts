import { Validator } from './validator';

export default function eq (expected: any, strict = true) {
  return new Validator('eq', (value) => {
    if (strict) {
      return value !== expected;
    } else {
      // eslint-disable-next-line eqeqeq
      return value != expected;
    }
  });
}
