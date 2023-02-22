import { Validator } from '../validator';
import _if from './if';

export default function optional(validator: Validator) {
  return _if((value: any) => value !== null && value !== undefined && value !== '', validator);
}
