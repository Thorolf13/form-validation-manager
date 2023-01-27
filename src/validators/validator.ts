import { flattenDeep } from "../commons/flatendeep";

export type Component = any;

export type Indexes = { length: number; } & Record<string | number, number>;

export type Context = {
  path: string,
  indexes?: Indexes,
  parent?: any,
  value: any;
};

export type HasErrorCallbackReturn = boolean | string | (boolean | string)[];
export type HasErrorCallback = (this: Component, value: any, context: Context) => HasErrorCallbackReturn;
export type HasErrorAsyncCallback = (this: Component, value: any, context: Context) => Promise<HasErrorCallbackReturn>;
export type Errors = false | string[];

function isPomise<T> (obj: any | Promise<T>): obj is Promise<T> {
  return obj && obj.then && obj.catch;
}

function manageErrors (errors: HasErrorCallbackReturn, defaultError: string) {
  if (!Array.isArray(errors)) {
    errors = [errors];
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

  constructor(public name: string, private hasErrorCallback: HasErrorCallback | HasErrorAsyncCallback) {
  }

  hasError (value: any, context: Context): Errors | Promise<Errors> {
    let errors = this.hasErrorCallback(value, context);
    if (isPomise(errors)) {
      return errors.then(err => {
        return manageErrors(err, context.path + '[' + this.name.toUpperCase() + '_ERROR]');
      });
    } else {
      return manageErrors(errors, context.path + '[' + this.name.toUpperCase() + '_ERROR]');
    }
  }
}