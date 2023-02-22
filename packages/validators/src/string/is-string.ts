import { Validator } from '../validator';
export default function isString() {
  return new Validator('isString', value => {
    if (value === null || value === undefined) {
      return false;
    }
    return typeof value !== 'string';
  });
}
