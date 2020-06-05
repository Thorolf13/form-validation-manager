export default function xor(...validators: Validator[]) {
  return new Validator('xor', (value, context) => {
    const errors = validators.map(v => v.hasError(value, context)).filter(e => e !== false);

    return errors.length === validators.length - 1 ? false : ([] as (boolean | string)[]).concat(...errors);
  });
}
