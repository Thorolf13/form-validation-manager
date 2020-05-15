import { req } from './utils/commons';
import numeric from './numeric';

export default function gt (min) {
  return {
    $params: { name: 'gt', min },
    hasError: function (value) {
      if (req(value)) {
        return false;
      }

      if (numeric().hasError(value)) {
        return 'NOT_NUMERIC';
      }

      return !(value > min);
    },
    isValid: function (value) {
      return !this.hasError(value);
    }
  };
}
