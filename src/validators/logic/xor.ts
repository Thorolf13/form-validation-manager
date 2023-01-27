import { flattenDeep } from '../../commons/flatendeep';
import { Validator } from '../validator';

export default function xor (...validators: Validator[]) {
  return new Validator('xor', (value, context) => {
    const errors = validators.map(v => v.hasError(value, context)).filter(e => e !== false);

    if (errors.length === 0) {
      return true;
    }
    return errors.length === validators.length - 1 ? false : flattenDeep(errors);
  });
}
