import { req } from './utils/commons';
import numeric from './numeric';

export default function lte (max) {
  return {
    $params: { name: 'lte', max },
    hasError: function (value) {
      if (req(value)) {
        return false;
      }

      if (numeric().hasError(value)) {
        return 'NOT_NUMERIC';
      }

      return !(value <= max);
    },
    isValid: function (value) {
      return !this.hasError(value);
    }
  };
}
