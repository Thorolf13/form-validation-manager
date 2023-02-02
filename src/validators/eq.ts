import { Validator } from './validator';

export default function eq (val: any, strict = true) {
  return new Validator('eq', (value) => {
    if (strict) {
      return value !== val;
    } else {
      // eslint-disable-next-line eqeqeq
      return value != val;
    }
  });
}
