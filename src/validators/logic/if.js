export default function _if (condition, validator) {
  return {
    $params: { name: 'if', children: [validator.$params] },
    hasError: function (value, context) {
      let test = condition;
      if (typeof condition === 'function') {
        test = condition.call(context.component, value, context);
      }

      if (test === false) {
        return false;
      }

      return validator.hasError(value, context);
    },
    isValid: function (value, context) {
      return !this.hasError(value, context);
    }
  };
}
