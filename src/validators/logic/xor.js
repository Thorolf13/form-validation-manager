export default function xor (...validators) {
  return {
    $params: { name: 'xor', children: validators.map(v => v.$params) },
    hasError: function (value, context) {
      const errors = validators.map(v => v.hasError(value, context)).filter(e => e !== false);

      return errors.length === validators.length - 1 ? false : errors;
    },
    isValid: function (value, context) {
      return !this.hasError(value, context);
    }
  };
}
