import { computed, getCurrentInstance, reactive, Ref, ref } from 'vue-demi';
import { ValidationApi } from '../fvm/api';
import { Fvm } from '../fvm/fvm';

const VALIDATIONS_PROPERTY_NAME = 'validations';

export default {
  install (Vue: any) {
    Vue.mixin({
      data () {
        return {
          _fvm: {
            fn: null,
            data: null
          }
        }
      },
      computed: {
        $fvm () {
          return (this as any)._fvm.data
        }
      },
      created () {
        const rules = this.$options[VALIDATIONS_PROPERTY_NAME];
        const instance = this;


        if (rules) {
          const apiProxy = {
            get: () => {
              return instance._fvm.data
            },
            set: (value: ValidationApi<any>) => {
              instance._fvm.data = value
            }
          }
          const fvm = new Fvm(this, null, rules, apiProxy);
          instance._fvm.fn = fvm;
        }
      },
      beforeMount () {
        if (this._fvm?.fn) {
          this._fvm.fn.startValidation();
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
