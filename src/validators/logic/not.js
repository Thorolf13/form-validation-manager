export default function not (validator) {
  return {
    $params: { name: 'not', children: [validator.$params] },
    hasError: function (value, context) {
      return validator.isValid(value, context);
    },
    isValid: function (value, context) {
      return !this.hasError(value, context);
    }
  };
}
