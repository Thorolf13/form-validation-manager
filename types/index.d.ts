declare module 'form-validation-manager/validators' {

  type HasErrorCallbackReturn = boolean | string | Promise<boolean | string | (boolean | string)[]> | (boolean | string | Promise<boolean | string | (boolean | string)[]>)[];
  type HasErrorCallback = (this: Component, value: any, context: Context) => HasErrorCallbackReturn;
  type Errors = false | string[];

  class Validator {
    name: string;
    constructor (name: string, hasErrorCallback: HasErrorCallback);
    hasError (value: any, context: Context): Errors | Promise<Errors>;
  }

  type ValidatorsTree = {
    [x: string]: Validator | ValidatorsTree;
  };

  type Component = any;
  type Indexes = { length: number; } & Record<string | number, number>;
  type Context = {
    component?: Component;
    path: string,
    indexes?: Indexes,
    parent?: any,
    value: any;
  };

  function eq (val: any, strict?: boolean): Validator;
  function required (): Validator;
  function and (...validators: Validator[]): Validator;
  function and_sequence (...validators: Validator[]): Validator;
  function _if (condition: (this: Component, value: any, context: Context) => boolean, thenValidator: Validator, elseValidator?: Validator): Validator;
  function not (validator: Validator): Validator;
  function optional (validator: Validator): Validator;
  function or (...validators: Validator[]): Validator;
  function xor (...validators: Validator[]): Validator;
  function between (min: number, max: number, exclusive?: boolean): Validator;
  function gt (min: number): Validator;
  function gte (min: number): Validator;
  function lt (max: number): Validator;
  function lte (max: number): Validator;
  function numeric (): Validator;
  function email (): Validator;
  function includes (str: string): Validator;

  /**
   * check if value is a valid date string
   *
   * @param format date format \
   * \
   * ISO8601 exemple : "yyyy-MM-ddTHH:mm:ss.SSSZ"
   * String : "1900-01-01T16:00:00.000+02:00"\
   * \
   * yyyy : years 0000-9999\
   * yy years : 00-99\
   * MM : month 00-12\
   * M : month 0-12\
   * dd : day 00-31\
   * d : day 0-31\
   * HH : hour 00-23\
   * H hour 0-23\
   * hh : hour 00-12\
   * h hour 0-12\
   * mm : minutes 00-59\
   * m : minutes 0-59\
   * ss : seconds 00-59\
   * s : seconds 0-59\
   * S : 1/10 second\
   * SS : 1/100 second\
   * SSS : millisecond\
   * sss : millisecond\
   * Z : timezone +00:00\
   * ZZ : timezone +0000\
   * X : timestamp\
   * x : timestamp millisecond
   *
   */
  function isDate (format?: string): Validator;
  function isString (): Validator;
  function regexp (regexp: RegExp): Validator;
  function async (callback: (this: any, value: any, context: Context) => Promise<boolean | string | (boolean | string)[]>, debounceTime?: number): Validator;
  function custom (callback: (this: any, value: any, context: Context) => boolean | string | (boolean | string)[]): Validator;
  function empty (): Validator;
  function length (validator: Validator): Validator;
  function pick (property: string, validator: Validator): Validator;
  function revalidate (...paths: string[]): Validator;
  function withMessage (validator: Validator, message: string): Validator;

}


declare module 'form-validation-manager/vue3' {
  import { UnwrapNestedRefs } from "vue";
  import { ValidatorsTree } from "form-validation-manager/validators";


  type ValidationApi<V> = {
    $errors: string[];
    $error: boolean;
    $invalid: boolean;
    $valid: boolean;
    $isValid: boolean;
    $dirty: boolean;
    $pristine: boolean;
    $pending: boolean;

    setDirty (dirty?: boolean): void;
    validate (): void;
  } & {
      [P in Exclude<keyof V, '$fvm'>]: P extends "$each" ? ValidationApi<V[P]>[] : ValidationApi<V[P]>;
    };

  export function useFvm (): ValidationApi<any>;
  export function useFvm<T extends ValidatorsTree> (rules: T): ValidationApi<T>;
  export function useFvm<T extends ValidatorsTree> (state: UnwrapNestedRefs<any>, rules: T): ValidationApi<T>;
}

declare module 'form-validation-manager/vue2' {
  type ValidationApi<V> = {
    $errors: string[];
    $error: boolean;
    $invalid: boolean;
    $valid: boolean;
    $isValid: boolean;
    $dirty: boolean;
    $pristine: boolean;
    $pending: boolean;

    setDirty (dirty?: boolean): void;
    validate (): void;
  } & {
      [P in Exclude<keyof V, '$fvm'>]: P extends "$each" ? ValidationApi<V[P]>[] : ValidationApi<V[P]>;
    };

  type PluginObject<T> = {
    install: (Vue: any, options: T) => void;
  };

  export const Fvm: PluginObject<void>;
  export const FormvalidationManager: PluginObject<void>;
}
