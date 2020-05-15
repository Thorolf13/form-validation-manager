import { req } from './utils/commons';
import numeric from './numeric';

export default function between (min, max, exclusive = false) {
  return {
    $params: { name: 'between', min, max, exclusive },
    hasError: function (value) {
      if (req(value)) {
        return false;
      }

      if (numeric().hasError(value)) {
        return 'NOT_NUMERIC';
      }

      if (exclusive) {
        return !(value > min && value < max);
      } else {
        return !(value => min && value <= max);
      }
    },
    isValid: function (value) {
      return !this.hasError(value);
    }
  };
}
