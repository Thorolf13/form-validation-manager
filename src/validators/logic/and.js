export default function and (...validators) {
  return {
    $params: { name: 'and', children: validators.map(v => v.$params) },
    hasError: function (value, context) {
      const errors = validators.map(v => v.hasError(value, context)).filter(e => e !== false);

      return errors.length ? errors : false;
    },
    isValid: function (value, context) {
      return !this.hasError(value, context);
    }
  };
}
