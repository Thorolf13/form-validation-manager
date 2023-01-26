import { Validator } from '../validator';

export default function withMessage(validator: Validator, message: string) {
  return new Validator('with_message', (value, context) => {
    const errors = validator.hasError(value, context)
    return errors === false ? false : message;
  });
}
