export default function pick(property: string, validator: Validator) {
  return new Validator('pick', (value, context) => {
    try {
      const prop = value[property];
      return validator.hasError(prop, context);
    } catch (e) {
      return 'UNKNOW_PROPERTY';
    }
  });
}
