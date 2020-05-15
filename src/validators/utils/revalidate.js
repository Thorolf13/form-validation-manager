import { get } from 'lodash';

export default function revalidate (path) {
  let lock = false;
  return {
    $params: {},
    hasError: function (value, context) {
      if (lock) {
        return false;
      }

      lock = true;
      setTimeout(() => {
        lock = false;
      }, 100);

      try {
        get(context.component._fvm.validations, path)._fvm.forceRevalidate();
        context.component.$forceUpdate();
      } catch (e) { };
      return false;
    },
    isValid: function (value, context) {
      return !this.hasError(value, context);
    }
  };
}
