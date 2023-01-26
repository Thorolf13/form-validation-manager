import { req } from './utils/commons';
import { Validator } from './validator';

export default function required () {
  return new Validator('required', (value, context) => {
    let error = req(value)
    if (error) {
      error = context.path + '[' + error + ']'
    }

    return error
  });
}
