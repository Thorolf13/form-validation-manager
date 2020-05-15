export default function empty () {
  return {
    $params: {},
    hasError: function () {
      return false;
    },
    isValid: function () {
      return true;
    }
  };
}
