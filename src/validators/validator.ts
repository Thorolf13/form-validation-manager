type ValidatorParams = {
  name: string,
  children?: ValidatorParams[]
  [key: string]: any
}

type Context = {
  component: any;
  path: string;
  params: ValidatorParams;
}

type HasErrorCallback = (value: any, contetx: Context) => boolean | string | (boolean | string)[];

class Validator {
  constructor(public name: string, private hasErrorCallback: HasErrorCallback) {

  }

  hasError(value: any, context: Context): false | string | string[] {
    let errors = this.hasErrorCallback(value, context);
    if (!Array.isArray(errors)) {
      errors = [errors]
    }

    // si aucune erreur -> false
    errors = errors.filter(e => e !== false);
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

  isValid(value: any, context: Context): boolean {
    return this.hasError(value, context) === false;
  }

}