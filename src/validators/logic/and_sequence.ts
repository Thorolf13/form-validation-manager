import { Validator } from '../validator';

export default function andSequence (...validators: Validator[]) {
  return new Validator('and_sequence', (value, context) => {

    for (let i in validators) {
      const validator = validators[i];

      const errors = validator.hasError(value, context);

      if (errors !== false) {
        return errors;
      }
    }

    return false;
  });
}
