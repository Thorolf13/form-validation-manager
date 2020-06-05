import { req } from './utils/commons';

export default function required() {
  return new Validator('required', value => req(value));
}
