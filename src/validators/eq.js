import { req } from './utils/commons';

export default function eq (val, strict = true) {
  return {
    $params: { name: 'eq', value: val, strict },
    hasError: function (value) {
      if (req(value)) {
        return false;
      }

      if (strict) {
        return value !== val;
      } else {
        // eslint-disable-next-line eqeqeq
        return value != val;
      }
    },
    isValid: function (value) {
      return !this.hasError(value);
    }
  };
}
