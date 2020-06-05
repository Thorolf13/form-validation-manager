import { req } from './utils/commons'

export default function numeric() {
  return new Validator('numeric', value => {
    if (req(value)) {
      return false;
    }

    if (isNaN(value)) {
      return 'NOT_NUMERIC';
    }

    return false;
  });
}
