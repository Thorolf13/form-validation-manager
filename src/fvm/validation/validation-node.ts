import { Context } from "../../validators/validator";
import { Indexes } from "../types";
import { set as _get } from "vue-demi"
import { Component } from "../../vue-integration/component";
import { ValidationGroup } from "./validation-group";

export abstract class ValidationNode {
  //properties
  public children?: { [key: string]: ValidationNode };
  public parent?: ValidationGroup;

  protected component: Component;
  protected path: string;

  //abstract

  public abstract $errors: string[];
  public abstract $dirty: boolean;
  public abstract $pending: boolean;

  public abstract destroy (): void;
  public abstract validate (): void;


  //constructor

  constructor (component: Component, path: string, parent?: ValidationGroup) {
    this.component = component;
    this.path = path;
    this.parent = parent;
  }

  // functions

  public get $error () { return this.$errors.length > 0 };
  public get $invalid () { return this.$error; };
  public get $valid () { return !this.$error; };
  public get $isValid () { return !this.$error; };
  public get $pristine () { return !this.$dirty; };

  public getContext (): Context {
    const value = this.getValueByPath(this.path);
    const indexes = this.parseIndexes(this.path)
    return { component: this.component.getComponentInstance(), path: this.path, value, indexes, parent: this.parent?.getContext() }
  }

  protected getValueByPath (path: string) {
    return this.component.getPropertyByPath(path.replace(/^\./, ''));
  }

  protected parseIndexes (path: string) {
    const indexes: Indexes = { length: 0 };
    const reg = /(\w+)\[(\d+)\]/g;

    let match;
    while (match = reg.exec(path)) {
      indexes[indexes.length + ''] = +match[2];
      indexes[match[1]] = +match[2]

      indexes.length++;
    }

    return indexes.length ? indexes : undefined;
  }

  protected isRootNode () {
    return !this.parent;
  }
}
