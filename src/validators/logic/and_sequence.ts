export default function and_sequence(...validators: Validator[]) {
  return new Validator('and_sequence', (value, context) => {
    validators.forEach(validator => {
      const errors = validator.hasError(value, context);
      if (errors !== false) {
        return errors;
      }

    })

    return false;
  });
}
