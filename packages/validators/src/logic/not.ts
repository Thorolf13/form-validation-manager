import { Validator } from '../validator';

export default function not (validator: Validator) {
  return new Validator('not', (value, context) => {
    return validator.hasError(value, context) === false ? 'NOT_' + validator.name + '_ERROR' : false;
  });
}
