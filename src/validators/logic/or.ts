export default function or(...validators: Validator[]) {
  return new Validator('or', (value, context) => {
    const errors = validators.map(v => v.hasError(value, context)).filter(e => e !== false);

    return errors.length == validators.length ? ([] as (boolean | string)[]).concat(...errors) : false;
  });
}
