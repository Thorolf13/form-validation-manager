import { req } from '../utils/commons'
import { Validator } from '../validator';

export default function numeric () {
  return new Validator('numeric', value => {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value !== 'number') {
      return true;
    }

    if (isNaN(value)) {
      return true;
    }

    return false;
  });
}
