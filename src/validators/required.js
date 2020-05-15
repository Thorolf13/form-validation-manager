import { req } from './utils/commons';

export default function required () {
  return {
    $params: { name: 'required' },
    hasError: function (value) {
      return req(value);
    },
    isValid: function (value) {
      return !this.hasError(value);
    }
  };
}
