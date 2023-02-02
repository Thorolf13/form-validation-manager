import { computed, getCurrentInstance, reactive, Ref, ref } from 'vue-demi';
import { ValidationApi } from '../fvm/api';
import { Fvm } from '../fvm/fvm';

const VALIDATIONS_PROPERTY_NAME = 'validations';

function accessData (componentInstance: any) {
  return componentInstance.$data || componentInstance.$options.data()
}

export default {
  install (Vue: any) {
    Vue.mixin({
      data () {
        return {
          _fvm: {
            fn: null,
            isRunning: false,
            data: null
          }
        }
      },
      computed: {
        $fvm () {
          if (!accessData(this)._fvm.isRunning) {
            accessData(this)._fvm.isRunning = true;
            accessData(this)._fvm.fn.startValidation();
          }
          return accessData(this)._fvm.data
        }
      },
      created () {
        const rules = this.$options[VALIDATIONS_PROPERTY_NAME];
        const instance = this;

        if (rules) {
          const apiProxy = {
            get: () => {
              return accessData(instance)._fvm.data
            },
            set: (value: ValidationApi<any>) => {
              accessData(instance)._fvm.data = value
            }
          }
          const fvm = new Fvm(this, null, rules, apiProxy);
          accessData(instance)._fvm.fn = fvm;
        }
      },
      beforeDestroy () {
        if (this._fvm?.fn) {
          this._fvm.fn.destroy();
          this._fvm = undefined;
          this.$fvm = undefined;
        }
      },

      unmounted () {
        if (this._fvm?.fn) {
          this._fvm.fn.destroy();
          this._fvm = undefined;
          this.$options.computed.$fvm = undefined;
        }
      }
    });

  }
};
