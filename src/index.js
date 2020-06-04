import Fvm from './fvm';

import lt from './validators/lt';
import lte from './validators/lte';
import gt from './validators/gt';
import gte from './validators/gte';
import eq from './validators/eq';
import required from './validators/required';
import numeric from './validators/numeric';
import between from './validators/between';

import withMessage from './validators/utils/with-message';
import custom from './validators/utils/custom';
import revalidate from './validators/utils/revalidate';
import empty from './validators/utils/empty';

import or from './validators/logic/or';
import xor from './validators/logic/xor';
import and from './validators/logic/and';
import not from './validators/logic/not';
import _if from './validators/logic/if';


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

export {
  lt,
  lte,
  gt,
  gte,
  eq,
  required,
  numeric,
  between,
  or,
  xor,
  and,
  not,
  _if,
  withMessage,
  custom,
  revalidate,
  empty
};
