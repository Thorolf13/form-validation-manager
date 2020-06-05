export default function _if(condition: (value: any, context: Context) => boolean, validator: Validator) {
  return new Validator('if', (value, context) => {
    const test = condition.call(context.component, value, context);

    if (test === false) {
      return false;
    }

    return validator.hasError(value, context);
  });
}
