import { EventEmitter } from "../../commons/event";
import { flattenDeep } from "../../commons/flatendeep";
import { AsyncValidator, Validator } from "../../validators/validator";
import { Component } from "../../vue-integration/component";
import { EventsList, ValidatorsTree } from "../types";
import { Watcher } from "./../watcher";
import { ValidationNode } from "./validation-node";
import { ValidatorWrapper } from "./validator-wrapper";



export class ValidationGroup extends ValidationNode {
  //#######################################
  // propeties
  private watcher: Watcher;
  children: { [key: string]: ValidationNode } = {};
  parent?: ValidationGroup;

  public get $errors () {
    return flattenDeep(
      Object.keys(this.children)
        .map(key => this.children[key])
        .map(child => child.$errors)
    )
  };

  //#######################################
  // getters




  public get $dirty () {
    return Object.keys(this.children)
      .map(key => this.children[key])
      .map(child => child.$dirty)
      .reduce((item, result) => item || result, false);
  };
  public set $dirty (val) {
    Object.keys(this.children)
      .map(key => this.children[key])
      .forEach(child => child.$dirty = val);
  };

  public get $pending () {
    return Object.keys(this.children)
      .map(key => this.children[key])
      .some(child => child.$pending);
  };

  //#######################################
  // constructor

  constructor (private validators: ValidatorsTree, path: string, component: Component, private events: EventEmitter<EventsList>, parent?: ValidationGroup) {
    super(component, path, parent);
    this.watcher = new Watcher(this.component);
    this.setValidators(validators);
  }

  setValidators (validators: ValidatorsTree) {
    for (const key in validators) {
      const validator = validators[key];
      if (key === '$each') {
        if (this.isRootNode()) {
          throw Error('$each cant be used as root property')
        }
        this.watcher.watch(this.path as string, () => {
          this.deleteChild('$each');
          this.setChild('$each', this.each(validator))
        }, { deep: true, immediate: true })
      } else {
        if (key === '$self') {
          if (this.isRootNode()) {
            throw Error('$self cant be used as root property')
          }
          if (!(validator instanceof Validator || validator instanceof AsyncValidator)) {
            throw new Error('$self must be a validator')
          }
          this.setChild('$self', new ValidatorWrapper(validator, this.path as string, this.component, this.events, this))
        } else {
          const isIteration = /^\d+$/.test(key)
          const path = isIteration ? this.path + '[' + key + ']' : (this.path ? this.path + '.' : '') + key;
          if (validator instanceof Validator || validator instanceof AsyncValidator) {
            this.setChild(key, new ValidatorWrapper(validator, path, this.component, this.events, this))
          } else {
            this.setChild(key, new ValidationGroup(validator, path, this.component, this.events, this))
          }
        }
      }
    }
  }

  private each (validators: ValidatorsTree | Validator | AsyncValidator) {
    const arr = this.getValueByPath(this.path);

    const subValidators: ValidatorsTree = {};
    for (const index in arr) {
      subValidators[index] = validators;
    }

    return new ValidationGroup(subValidators, this.path, this.component, this.events, this);
  }


  //#######################################
  // functions

  getChild (key: string) {
    return this.children[key];
  }

  setChild (key: string, validation: ValidationNode) {
    this.children[key] = validation;
  }

  deleteChild (key: string) {
    if (this.children[key]) {
      this.children[key].destroy();
      delete this.children[key];
    }
  }

  destroy () {
    Object.keys(this.children)
      .map(key => this.children[key])
      .forEach(child => child.destroy());

    this.watcher.unwatchAll();
  }

  validate () {
    Object.keys(this.children)
      .map(key => this.children[key])
      .forEach(child => child.validate());
  }


  getValidationNodeByPath (path: string): ValidationNode {
    if (path === '')
      return this;

    if (path.startsWith(this.path)) {
      path = path.replace(this.path + '.', '');
      const pathParts = path.split('.');

      if (this.children && this.children[pathParts[0]]) {
        if (pathParts.length === 1)
          return this.children[pathParts[0]];
        else
          return (this.children[pathParts[0]] as ValidationGroup).getValidationNodeByPath(pathParts.slice(1).join('.'));
      } else {
        throw new Error(`ValidationNode with path ${path} not found in ${this.path}`);
      }
    } else {
      if (this.parent) {
        return this.parent.getValidationNodeByPath(path);
      } else {
        throw new Error(`ValidationNode with path ${path}`);
      }
    }

  }

}
