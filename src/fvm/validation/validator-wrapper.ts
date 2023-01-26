import { Ref, ref } from "vue-demi";
import { EventEmitter } from "../../commons/event";
import { flattenDeep } from "../../commons/flatendeep";
import { PromiseState, wrapPromiseState } from "../../commons/promise";
import { AsyncValidator, Validator } from "../../validators/validator";
import { Component } from "../../vue-integration/component";
import { EventsList } from "../types";
import { Watcher } from "../watcher";
import { ValidationGroup } from "./validation-group";
import { ValidationNode } from "./validation-node";


export class ValidatorWrapper extends ValidationNode {

  parent?: ValidationGroup;

  private watcher: Watcher;

  private _errors: Ref<(string | Promise<string> & PromiseState<string>)[]> = ref([]);
  private _dirty = false;

  public get $errors () {
    const errors = this._errors.value.map(err => {
      if (err instanceof Promise) {
        return err.isPending() ? false : err.getResponse();
      } else {
        return err;
      }
    }).filter(err => !!err) as string[];

    return flattenDeep(errors);
  };

  public get $dirty () { return this._dirty; };
  public set $dirty (val) { this._dirty = val; };

  public get $pending () {
    for (const err of this._errors.value) {
      if (err instanceof Promise && err.isPending()) {
        return true;
      }
    }
    return false;
  };

  //#######################################
  // constructor

  constructor (private validator: Validator | AsyncValidator, path: string, component: Component, private events: EventEmitter<EventsList>, parent?: ValidationGroup) {
    super(component, path, parent)
    if (validator.name !== 'revalidate') {
      this.validate();
    }
    this.watcher = new Watcher(component);
    this.watcher.watch(path, (n, o) => this.onChange(o, n), { deep: true });
  }

  public destroy () {
    this.watcher.unwatchAll();
  }

  public validate () {
    const errors = this.callValidator();
    this._errors.value = errors === false ? [] : flattenDeep([errors]).map(e => e instanceof Promise ? wrapPromiseState(e) : e);
  }

  private onChange (oldVal: any, newVal: any) {
    if (oldVal !== newVal) {
      this._dirty = true;
    }
    this.validate();
    this.component.forceUpdate();
  }

  private callValidator () {
    const value = this.getValueByPath(this.path);
    const context = this.getContext()

    const response = this.validator.hasError(value, context);
    if (this.validator.name === 'revalidate') {
      const paths: string[] = response as any
      if (paths) {
        paths.forEach(path => {
          try {
            this.parent?.getValidationNodeByPath(path).validate()
            this.component.forceUpdate();
          } catch (e: any) {
            console.warn(e.message)
          }
        })
      }

      return false;
    }

    if (response instanceof Promise) {
      this.events.emit('pending', { path: this.path, value });
      return response.then(v => {
        setTimeout(() => { this.events.emit('done', { path: this.path, value, response: v }); });
        this.component.forceUpdate();
        return v;
      }).catch(error => {
        setTimeout(() => { this.events.emit('error', { path: this.path, value, error }); });
        this.component.forceUpdate();
        throw error;
      })
    } else {
      setTimeout(() => { this.events.emit('done', { path: this.path, value, response }); });
      return response;
    }
  }
}
