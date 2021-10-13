import { flattenDeep } from "../commons/flatendeep";

export type Component = any;

export type Indexes = { length: number; } & Record<string | number, number>

export type Context = {
  component: Component;
  path: string,
  indexes?: Indexes
}

export type HasErrorCallbackReturn = boolean | string | (boolean | string)[]
export type HasErrorCallback = (this: Component, value: any, context: Context) => HasErrorCallbackReturn;
export type HasErrorAsyncCallback = (this: Component, value: any, context: Context) => Promise<HasErrorCallbackReturn>;

function isPomise<T>(obj: any | Promise<T>): obj is Promise<T> {
  return obj && obj.then && obj.catch;
}

function manageErrors(errors: HasErrorCallbackReturn, defaultError: string) {
  if (!Array.isArray(errors)) {
    errors = [errors]
  }

  // si aucune erreur -> false
  errors = errors.filter(e => e !== false && e !== null && e !== undefined);
  if (errors.length === 0) {
    return false;
  }

  // si erreur(s) sans message -> creation d'un message generique
  errors = errors.filter(e => e !== true);
  if (errors.length === 0) {
    return [defaultError];
  }

  // sinon, renvoi des messages présents
  return flattenDeep(errors) as string[];
}

export class Validator {
  constructor(public name: string, private hasErrorCallback: HasErrorCallback) {

  }

  public hasError(value: any, context: Context) {
    let errors = this.hasErrorCallback(value, context);
    return manageErrors(errors, this.name.toUpperCase() + '_ERROR')
  }

  public isValid(value: any, context: Context): boolean {
    return this.hasError(value, context) === false;
  }
}

export class AsyncValidator {
  constructor(public name: string, private hasErrorCallback: HasErrorAsyncCallback) {

  }

  public hasError(value: any, context: Context) {
    return this.hasErrorCallback(value, context).then(errors => {
      return manageErrors(errors, this.name.toUpperCase() + '_ERROR')
    });
  }

  public isValid(value: any, context: Context): Promise<boolean> {
    return this.hasError(value, context).then(errors => errors === false);
  }
}
