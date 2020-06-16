import { length, custom } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('length validator', () => {
  const context = { component: {}, path: '' };

  it('should be instance of Validator', () => {
    const validator = length(custom(() => false));
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should get length of array', () => {
    const value = [1, 2, 3];

    const validator = length(custom((val) => {
      expect(val).to.equal(3);
      return false;
    }));

    validator.hasError(value, context);
  })

  it('should get length of string', () => {
    const value = 'abcde';

    const validator = length(custom((val) => {
      expect(val).to.equal(5);
      return false;
    }));

    validator.hasError(value, context);
  })

  it('should return error if sub property length dont exist', () => {
    const value = {};

    const validator = length(custom(() => false));

    expect(validator.hasError(value, context)).to.eql(['UNKNOW_PROPERTY']);
  })

  it('should return error if obj is null', () => {
    const value = null;

    const validator = length(custom(() => false));

    expect(validator.hasError(value, context)).to.eql(['UNKNOW_PROPERTY']);
  })
});