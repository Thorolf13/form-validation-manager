
export default class Fvm {
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

    Object.defineProperty(validation, '$invalid', {
      enumerable: false,
      configurable: true,
      get: () => !validation.$isValid
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

    Object.defineProperty(validation, '$pristine', {
      enumerable: false,
      configurable: true,
      get: () => !validation.$dirty
    });

    return validation;
  }

  cascadeValidation (validations) {

    Object.defineProperty(validations, '$errors', {
      enumerable: false,
      configurable: true,
      get: () => {
        const errs = Object.values(validations).map(i => i.$errors).reduce((t, i) => t.concat(i), []).filter(i => i);
        return errs.length ? errs : false;
      }
    });

    Object.defineProperty(validations, '$isValid', {
      enumerable: false,
      configurable: true,
      get: () => Object.values(validations).map(i => i.$isValid).reduce((t, i) => t && i, true)
    });

    Object.defineProperty(validations, '$invalid', {
      enumerable: false,
      configurable: true,
      get: () => !validations.$isValid
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

    Object.defineProperty(validations, '$pristine', {
      enumerable: false,
      configurable: true,
      get: () => !validations.$dirty
    });

    return validations;
  }
}