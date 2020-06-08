import { Validator } from '../validator';

export default function empty() {
  return new Validator('empty', () => false);
}
