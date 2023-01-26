import { PluginObject } from 'vue';


//plugin
interface PluginOptions {
  validationsPropertyName?: string
}

export const Fvm: PluginObject<PluginOptions>;
export const FormvalidationManager: PluginObject<PluginOptions>;

//validators
export declare class Validator {
  name: string;
  private hasErrorCallback;
  constructor (name: string, hasErrorCallback: HasErrorCallback);
  hasError (value: any, context: Context): false | string[];
  isValid (value: any, context: Context): boolean;
}
export declare class AsyncValidator {
  name: string;
  private hasErrorCallback;
  constructor (name: string, hasErrorCallback: HasErrorAsyncCallback);
  hasError (value: any, context: Context): Promise<false | string[]>;
  isValid (value: any, context: Context): Promise<boolean>;
}
export type Component = any;
export type Indexes = { length: number; } & Record<string | number, number>
export type Context = {
  component: Component;
  path: string;
  indexes?: Indexes;
};

export type HasErrorCallbackReturn = boolean | string | (boolean | string)[];
export type HasErrorCallback = (this: Component, value: any, context: Context) => HasErrorCallbackReturn;
export type HasErrorAsyncCallback = (this: Component, value: any, context: Context) => Promise<HasErrorCallbackReturn>;

export function eq (val: any, strict?: boolean): Validator;
export function required (): Validator;
export function and (...validators: Validator[]): Validator;
export function and_sequence (...validators: Validator[]): Validator;
export function _if (condition: (this: Component, value: any, context: Context) => boolean, thenValidator: Validator, elseValidator?: Validator): Validator;
export function not (validator: Validator): Validator;
export function optional (validator: Validator): Validator;
export function or (...validators: Validator[]): Validator;
export function xor (...validators: Validator[]): Validator;
export function between (min: number, max: number, exclusive?: boolean): Validator;
export function gt (min: number): Validator;
export function gte (min: number): Validator;
export function lt (max: number): Validator;
export function lte (max: number): Validator;
export function numeric (): Validator;
export function email (): Validator;
export function includes (str: string): Validator;

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
export function isDate (format?: string): Validator;
export function isString (): Validator;
export function regexp (regexp: RegExp): Validator;
export function async (callback: HasErrorAsyncCallback, forceRenderUpdateAuto?: boolean, debounceTime?: number): AsyncValidator;
export function custom (callback: HasErrorCallback): Validator;
export function empty (): Validator;
export function length (validator: Validator): Validator;
export function pick (property: string, validator: Validator): Validator;
export function revalidate (...paths: string[]): Validator;
export function withMessage (validator: Validator, message: string): Validator;


//events

type Listener = (...args: any[]) => void;
declare class EventEmitter<T extends string> {
  private readonly events;
  constructor ();
  on (event: T, listener: Listener): () => void;
  off (event: T, listener: Listener): void;
  removeAll (): void;
  emit (event: T, ...args: any[]): void;
  once (event: T, listener: Listener): void;
}
type EventsList = 'pending' | 'done';


//mixin
interface ValidationObject_ {
  $errors: string[];
  $error: boolean;
  $invalid: boolean;
  $valid: boolean;
  $isValid: boolean;
  $dirty: boolean;
  $pristine: boolean;
  $pending: Boolean;
  validate: () => void;
}
interface ValidationObject_recursive { [key: string]: ValidationObject }
type ValidationObject = ValidationObject_ & ValidationObject_recursive;

type FvmValidationResult = ValidationObject & { $events: EventEmitter<EventsList> };


import Vue from 'vue'
declare module 'vue/types/vue' {
  interface Vue {
    $fvm: FvmValidationResult
  }
}

import { DefaultComputed, DefaultData, DefaultMethods, PropsDefinition, DefaultProps } from 'vue/types/options';

declare module 'vue/types/options' {

  interface ComponentOptions<
    V extends Vue,
    Data = DefaultData<V>,
    Methods = DefaultMethods<V>,
    Computed = DefaultComputed,
    PropsDef = PropsDefinition<DefaultProps>,
    Props = DefaultProps> {
    validations?: any;
  }
}
