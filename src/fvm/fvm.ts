import { Component, ValidatorsTree } from './types';
import { ValidationNode, ValidationGroup } from './validation';

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
};
interface ValidationObject_recursive { [key: string]: ValidationObject };
type ValidationObject = ValidationObject_ & ValidationObject_recursive;

export default class Fvm {

  public validation: ValidationObject | null = null;
  private rootValidationGroup?: ValidationGroup;

  constructor(private componentInstance: Component, private validators: ValidatorsTree, private rootPath: string) { }

  public buildValidation() {
    this.rootValidationGroup = new ValidationGroup(this.validators, this.rootPath, this.componentInstance)
    this.validation = this.buildValidationTree(this.rootValidationGroup);
  }


  private buildValidationTree(validation: ValidationNode) {
    const res: any = {};

    Object.defineProperty(res, 'validate', { configurable: true, get: () => () => { validation.validate(); } })

    const props: ('$errors' | '$error' | '$invalid' | '$valid' | '$isValid' | '$dirty' | '$pristine' | '$pending')[] = ['$errors', '$error', '$invalid', '$valid', '$isValid', '$dirty', '$pristine', '$pending']
    // Object.defineProperty(res, '$dirty', { configurable: true, get: () => validation.$dirty, set: val => validation.$dirty = val })
    for (const prop of props) {
      Object.defineProperty(res, prop, { configurable: true, get: () => validation[prop], set: val => validation[prop] = val })
    }

    if (validation.children) {
      for (const key in validation.children) {
        Object.defineProperty(res, key, { configurable: true, enumerable: true, get: () => this.buildValidationTree(validation.children![key]) })
      }
    }

    return res as ValidationObject;
  }

  destroy() {
    this.rootValidationGroup?.destroy();
  }
}