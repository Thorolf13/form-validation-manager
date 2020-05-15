export default function withMessage (validator, message) {
  return {
    $params: validator.$params,
    hasError: function (value, context) {
      const errors = validator.hasError(value, context);
      return errors ? message : false;
    },
    isValid: function (value, context) {
      return !this.hasError(value, context);
    }
  };
}
