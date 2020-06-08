export type Component = any;

export type Context = {
  component: Component;
  path: string
}


export type HasErrorCallback = (this: Component, value: any, context: Context) => boolean | string | (boolean | string)[];

export class Validator {
  constructor(public name: string, private hasErrorCallback: HasErrorCallback) {

  }

  public hasError(value: any, context: Context): false | string | string[] {
    let errors = this.hasErrorCallback(value, context);
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
      return this.name.toUpperCase() + '_ERROR';
    }

    // sinon, renvoi des messages présents
    return errors as string[];

  }

  public isValid(value: any, context: Context): boolean {
    return this.hasError(value, context) === false;
  }

}