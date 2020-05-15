import { get } from 'lodash';

import lt from './validators/lt';
import lte from './validators/lte';
import gt from './validators/gt';
import gte from './validators/gte';
import eq from './validators/eq';
import required from './validators/required';
import numeric from './validators/numeric';
import between from './validators/between';

import withMessage from './validators/utils/with-message';
import dynamic from './validators/utils/dynamic';
import custom from './validators/utils/custom';
import revalidate from './validators/utils/revalidate';
import empty from './validators/utils/empty';

import or from './validators/logic/or';
import xor from './validators/logic/xor';
import and from './validators/logic/and';
import not from './validators/logic/not';
import _if from './validators/logic/if';

class Fvm {
  // eslint-disable-next-line space-before-function-paren
  constructor(componentInstance, validators, rootPath) {
    this.componentInstance = componentInstance;
    this.validators = validators;
    this.rootPath = rootPath;
    this.validations = null;
    this.watchers = {};
  }

  each (validators) {
    const value = this.getValueByPath(this.rootPath);

    const subValidators = {};
    for (const key in value) {
      subValidators[key] = validators;
    }

    return new Fvm(this.componentInstance, subValidators, this.rootPath);
  }

  validate () {
    if (this.validations) {
      return this.validations;
    }
    this.unwatchAll();
    let validations = {};

    if (this.isValidator(this.validators)) {
      validations = this.validateProp(this.validators, this.rootPath);
    } else {
      for (const key in this.validators) {
        if (key === '$each') {
          this.watch(this.rootPath, () => {
            if (validations[key]) {
              validations[key]._fvm.destroy();
            }
            this.addSubFvm(validations, key, this.each(this.validators[key]));
          }, { deep: true, immediate: true });
        } else {
          const validators = this.validators[key];
          const path = (this.rootPath ? this.rootPath + '.' : '') + key;
          this.addSubFvm(validations, key, new Fvm(this.componentInstance, validators, path));
        }
      }

      this.cascadeValidation(validations);
    }

    Object.defineProperty(validations, '_fvm', { configurable: true, get: () => this });
    Object.defineProperty(validations, '_destroy', { configurable: true, get: () => () => this.destroy() });
    Object.defineProperty(validations, 'validate', { configurable: true, get: () => () => this.setAsDirty() });

    this.validations = validations;
    return validations;
  }

  addSubFvm (validations, key, subFvm) {
    subFvm.validate();
    Object.defineProperty(validations, '_' + key, { configurable: true, value: subFvm });
    Object.defineProperty(validations, key, { configurable: true, enumerable: true, get: () => subFvm.validations });
  }

  setAsDirty () {
    for (const key in this.validations) {
      this.validations[key]._fvm.setAsDirty();
    }

    try {
      this.validations.$dirty = true;
    } catch (e) { }

    this.componentInstance.$forceUpdate();
  }

  unwatchAll () {
    for (const key in this.watchers) {
      this.unwatch(key);
    }
  }

  unwatch (key) {
    this.watchers[key].unwatch();
    delete this.watchers[key];
  }

  watch (key, callback, options) {
    if (this.watchers[key]) {
      this.unwatch(key);
    }
    const watcher = this.componentInstance.$watch(key, (o, n) => {
      callback(o, n);
      this.componentInstance.$forceUpdate();
    }, options);

    this.watchers[key] = { unwatch: watcher, callback };
  }

  forceRevalidate () {
    for (const key in this.watchers) {
      this.watchers[key].callback();
    }
    for (var key in this.validations) {
      if (this.validations[key]._fvm) {
        this.validations[key]._fvm.forceRevalidate();
      }
    }
  }

  destroy () {
    this.componentInstance = null;
    this.validators = null;
    this.rootPath = null;
    this.unwatchAll();
    for (const key in this.validations) {
      this.validations[key]._fvm.destroy();
    }
  }

  isValidator (obj) {
    if (typeof obj === 'object' && obj.hasError && obj.isValid) {
      return true;
    } else {
      return false;
    }
  }

  getValueByPath (path) {
    return get(this.componentInstance, path.replace(/^\./, ''));
  }

  callValidator (validator, path) {
    const error = validator.hasError(this.getValueByPath(path), { component: this.componentInstance, params: validator.$params, path });
    return error === false ? [] : [error].flat();
  }

  validateProp (validator, path) {
    const validation = {};

    let _errors = this.callValidator(validator, path);
    let _dirty = false;

    this.watch(path, (oldVal, newVal) => {
      if (oldVal !== newVal) {
        validation.$dirty = true;
      }
      validation.$errors = this.callValidator(validator, path);
    }, { deep: true });

    Object.defineProperty(validation, '$errors', {
      enumerable: false,
      configurable: true,
      get: () => _errors,
      set: (val) => { _errors = val; }
    });

    Object.defineProperty(validation, '$isValid', {
      enumerable: false,
      configurable: true,
      get: () => validation.$errors === false || validation.$errors.length === 0
    });

    Object.defineProperty(validation, '$error', {
      enumerable: false,
      configurable: true,
      get: () => !validation.$isValid
    });

    Object.defineProperty(validation, '$dirty', {
      enumerable: false,
      configurable: true,
      get: () => _dirty,
      set: (val) => { _dirty = val; }
    });

    return validation;
  }

  cascadeValidation (validations) {
    Object.defineProperty(validations, '$isValid', {
      enumerable: false,
      configurable: true,
      get: () => Object.values(validations).map(i => i.$isValid).reduce((t, i) => t && i, true)
    });

    Object.defineProperty(validations, '$error', {
      enumerable: false,
      configurable: true,
      get: () => !validations.$isValid
    });

    Object.defineProperty(validations, '$dirty', {
      enumerable: false,
      configurable: true,
      get: () => Object.values(validations).map(i => i.$dirty).reduce((t, i) => t || i, false)
    });

    Object.defineProperty(validations, '$errors', {
      enumerable: false,
      configurable: true,
      get: () => {
        const errs = Object.values(validations).map(i => i.$errors).reduce((t, i) => t.concat(i), []).filter(i => i);
        return errs.length ? errs : false;
      }
    });

    return validations;
  }
}

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
      // created () {
      //   if (this._fvm) {
      //     this._fvm.init();
      //   }
      // },
      beforeDestroy () {
        if (this._fvm) {
          this._fvm.destroy();
          this._fvm = null;
        }
      }
    });
    // Vue.helpers = helpers;
    // Vue.prototype.$helpers = helpers;
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
  dynamic,
  custom,
  revalidate,
  empty
};
