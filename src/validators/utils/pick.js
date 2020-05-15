export default function pick (property, validator) {
  return {
    $params: { name: 'pick', property, children: validator.$params },
    hasError: function (value, context) {
      let prop = null;
      if (value !== null && value !== undefined) {
        if (value[property] != undefined && value[property] != null) {
          prop = value[property];
        }
      }

      if (prop === null) {
        throw new Error('value : ' + value + ' has not property "' + property + '"');
        return 'UNKNOW_PROPERTY'
      }

      return validator.hasError(prop, context);
    },
    isValid: function (value, context) {
      return !this.hasError(value, context);
    }
  };
}
