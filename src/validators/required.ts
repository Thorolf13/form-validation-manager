import { req } from './utils/commons';
import { Validator } from './validator';

export default function required() {
  return new Validator('required', value => req(value));
}
