export default function not(validator: Validator) {
  return new Validator('not', (value, context) => {
    return validator.isValid(value, context) ? 'NOT_' + validator.name + '_ERROR' : false;
  });
}
