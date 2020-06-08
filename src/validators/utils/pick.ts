import { Validator } from '../validator';

export default function pick(property: string, validator: Validator) {
  return new Validator('pick', (value, context) => {

    if (value && value.hasOwnProperty(property)) {
      const prop = value[property];
      return validator.hasError(prop, context);
    } else {
      return 'UNKNOW_PROPERTY';
    }
  });
}
