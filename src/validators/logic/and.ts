import { flattenDeep } from '../../commons/flatendeep';
import { Validator } from '../validator';

export default function and (...validators: Validator[]) {
  return new Validator('and', (value, context) => {
    const errors = validators.map(v => v.hasError(value, context)).filter(e => e !== false);

    return errors.length ? flattenDeep(errors) : false;
  });
}
