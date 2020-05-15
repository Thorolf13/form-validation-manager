import { req } from './utils/commons';
import numeric from './numeric';

export default function lt (max) {
  return {
    $params: { name: 'lt', max },
    hasError: function (value) {
      if (req(value)) {
        return false;
      }

      if (numeric().hasError(value)) {
        return 'NOT_NUMERIC';
      }

      return !(value < max);
    },
    isValid: function (value) {
      return !this.hasError(value);
    }
  };
}
