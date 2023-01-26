import { Component } from './component';
import { Fvm } from '../fvm/fvm';
import { isVue2, isVue3 } from 'vue-demi';

const VALIDATIONS_PROPERTY_NAME = 'validations';

export default {
  install (Vue: any) {
    Vue.mixin({
      beforeCreate () {
        const vals = this.$options[VALIDATIONS_PROPERTY_NAME];

        if (!vals) return;
        if (!this.$options.computed) this.$options.computed = {};
        if (this.$options.computed.$fvm) return;


        if (vals) {
          let component = new Component(this, null);
          const fvm = new Fvm(component, vals);
          this._fvm = fvm;
        }

        this.$options.computed.$fvm = function () {
          if (!this._fvm.rootNode) {
            this._fvm.buildValidationTree();
          }
          return this._fvm?.getPublicApi();
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
