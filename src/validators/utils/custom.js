export default function custom (callback) {
  return {
    $params: { name: 'custom' },
    hasError: function (value, context) {
      let res = callback.call(context.component, value, context);

      if (!res) {
        return false;
      }

      if (Array.isArray(res)) {
        res = res.filter(i => !!i);
        if (res.length === 0) {
          return false;
        }
      }

      return res;
    },
    isValid: function (value, context) {
      return !this.hasError(value, context);
    }
  };
}
