import { Validator } from "..";
import { Component, ValidatorsTree, EventsList } from "./types";
import { get } from '../commons/lodash';
import { flattenDeep } from "../commons/flatendeep";
import { Watcher } from "./watcher";
import { AsyncValidator } from "../validators/validator";

import { PromiseState, wrapPromiseState } from './promise'
import { EventEmitter } from "./event";

export interface ValidationNode {
  children?: { [key: string]: ValidationNode };

  $errors: string[];
  $error: boolean;
  $invalid: boolean;
  $valid: boolean;
  $isValid: boolean;
  $dirty: boolean;
  $pristine: boolean;
  $pending: boolean;

  destroy: () => void;
  validate: () => void;
}

export class ValidationGroup implements ValidationNode {
  private watcher: Watcher;
  children: { [key: string]: ValidationNode } = {};

  public get $errors() {
    return flattenDeep(
      Object.keys(this.children)
        .map(key => this.children[key])
        .map(child => child.$errors)
    )
  };
  // public set $errors(err) { this._errors = err; };

  public get $error() { return this.$errors.length > 0 };
  public get $invalid() { return this.$error; };

  public get $valid() { return !this.$error; };
  public get $isValid() { return !this.$error; };


  public get $dirty() {
    return Object.keys(this.children)
      .map(key => this.children[key])
      .map(child => child.$dirty)
      .reduce((item, result) => item || result, false);
  };
  public set $dirty(val) {
    Object.keys(this.children)
      .map(key => this.children[key])
      .forEach(child => child.$dirty = val);
  };

  public get $pristine() { return !this.$dirty; };

  public get $pending() {
    return Object.keys(this.children)
      .map(key => this.children[key])
      .reduce((pending, child) => child.$pending || pending, false);
  };

  constructor(private validators: ValidatorsTree, private rootPath: string, private componentInstance: Component, private events: EventEmitter<EventsList>) {
    this.watcher = new Watcher(componentInstance);

    for (const key in validators) {
      const validator = validators[key];
      const path = (rootPath ? rootPath + '.' : '') + key;
      if (validator instanceof Validator || validator instanceof AsyncValidator) {
        this.setChild(key, new ValidatorWrapper(validator, path, componentInstance, events))
      } else {
        if (key === '$each') {
          this.watcher.watch(rootPath, () => {
            this.deleteChild('$each');
            this.setChild('$each', this.each(validator, rootPath))
          }, { deep: true, immediate: true })
        } else {
          this.setChild(key, new ValidationGroup(validator, path, componentInstance, events))
        }
      }
    }
  }

  private each(validators: ValidatorsTree, rootPath: string) {
    const arr = this.getValueByPath(rootPath);

    const subValidators: { [i: string]: ValidatorsTree } = {};
    for (const index in arr) {
      subValidators[index] = validators;
    }

    return new ValidationGroup(subValidators, rootPath, this.componentInstance, this.events);
  }

  setChild(key: string, validation: ValidationNode) {
    this.children[key] = validation;
  }

  deleteChild(key: string) {
    if (this.children[key]) {
      this.children[key].destroy();
      delete this.children[key];
    }
  }

  destroy() {
    Object.keys(this.children)
      .map(key => this.children[key])
      .forEach(child => child.destroy());

    this.watcher.unwatchAll();
  }

  validate() {
    Object.keys(this.children)
      .map(key => this.children[key])
      .forEach(child => child.validate());
  }

  private getValueByPath(path: string) {
    return get(this.componentInstance, path.replace(/^\./, ''));
  }
}

export class ValidatorWrapper implements ValidationNode {

  private watcher: Watcher;

  private _errors: (string | Promise<string> & PromiseState<string>)[] = [];
  private _dirty = false;

  public get $errors() {
    const errors = this._errors.map(err => {
      if (err instanceof Promise) {
        return err.isPending() ? false : err.getResponse();
      } else {
        return err;
      }
    }).filter(err => !!err) as string[];

    return flattenDeep(errors);
  };
  // public set $errors(err) { this._errors = err; };

  public get $error() { return this.$errors.length > 0; };
  public get $invalid() { return this.$error; };

  public get $valid() { return !this.$error; };
  public get $isValid() { return !this.$error; };


  public get $dirty() { return this._dirty; };
  public set $dirty(val) { this._dirty = val; };

  public get $pristine() { return !this._dirty; };

  public get $pending() {
    for (const err of this._errors) {
      if (err instanceof Promise && err.isPending()) {
        return true;
      }
    }
    return false;
  };

  constructor(private validator: Validator | AsyncValidator, private path: string, private componentInstance: Component, private events: EventEmitter<EventsList>) {
    this.validate()
    this.watcher = new Watcher(componentInstance);
    this.watcher.watch(this.path, (...args) => this.onChange(...args), { deep: true })
  }

  public destroy() {
    this.watcher.unwatchAll();
  }

  public validate() {
    const errors = this.callValidator();
    this._errors = errors === false ? [] : flattenDeep([errors]).map(e => e instanceof Promise ? wrapPromiseState(e) : e);
  }

  //////////////////////////////////////////////////

  private onChange(oldVal: any, newVal: any) {
    if (oldVal !== newVal) {
      this._dirty = true;
    }
    this.validate();
  }

  private getValueByPath(path: string) {
    return get(this.componentInstance, path.replace(/^\./, ''));
  }

  private callValidator() {
    const value = this.getValueByPath(this.path);
    const response = this.validator.hasError(value, { component: this.componentInstance, path: this.path });

    if (response instanceof Promise) {
      this.events.emit('pending', { path: this.path, value });
      return response.then(v => {
        setTimeout(() => { this.events.emit('done', { path: this.path, value, response: v }); });
        return v;
      }).catch(error => {
        setTimeout(() => { this.events.emit('done', { path: this.path, value, error }); });
        throw error;
      })
    } else {
      setTimeout(() => { this.events.emit('done', { path: this.path, value, response }); });
      return response;
    }
  }
}