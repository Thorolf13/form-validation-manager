import Fvm from './fvm';

export default {
  install (Vue, options) {
    const validationsPropertyName = options && options.validationsPropertyName ? options.validationsPropertyName : 'validations';

    Vue.mixin({
      data () {
        const vals = this.$options[validationsPropertyName];
        if (vals) {
          this._fvm = new Fvm(this, vals);
        }
        return {};
      },
      beforeCreate () {
        const options = this.$options;
        const vals = options[validationsPropertyName];
        if (!vals) return;
        if (!options.computed) options.computed = {};
        if (options.computed.$fvm) return;
        options.computed.$fvm = function () {
          return this._fvm ? this._fvm.validate() : null;
        };
      },
      beforeDestroy () {
        if (this._fvm) {
          this._fvm.destroy();
          this._fvm = null;
        }
      }
    });

  }
};