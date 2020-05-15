import { req } from './utils/commons';

export default function numeric () {
  return {
    $params: { name: 'numeric' },
    hasError: function (value) {
      if (req(value)) {
        return false;
      }

      if (isNaN(value)) {
        return 'NOT_NUMERIC';
      }

      return false;
    },
    isValid: function (value) {
      return !this.hasError(value);
    }
  };
}
