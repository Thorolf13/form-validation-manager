import { Fvm } from '../fvm/fvm';

const VALIDATIONS_PROPERTY_NAME = 'validations';

export default {
  install (Vue: any) {
    Vue.mixin({
      beforeCreate () {
        const rules = this.$options[VALIDATIONS_PROPERTY_NAME];

        if (!rules) return;
        if (!this.$options.computed) this.$options.computed = {};
        if (this.$options.computed.$fvm) return;


        if (rules) {
          // let component = new Component(this, null);
          const fvm = new Fvm(this, null, rules);
          this._fvm = fvm;
        }

        this.$options.computed.$fvm = function () {
          if (!this._fvm) return;

          if (!this._fvm.rootNode) {
            this._fvm.buildValidationTree();
          }
          return this._fvm.getPublicApi();
        };
      },
      beforeDestroy () {
        if (this._fvm) {
          this._fvm.destroy();
          this._fvm = undefined;
          this.$options.computed.$fvm = undefined;
        }
      }
    });

  }
};
