export default function dynamic (callback) {
  return {
    $params: {},
    hasError: function (value, context) {
      const validator = callback.call(context.component, context);
      return validator.hasError(value, context);
    },
    isValid: function (value, context) {
      return !this.hasError(value, context);
    }
  };
}
