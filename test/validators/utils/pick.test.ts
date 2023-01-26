import { pick, custom } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('pick validator', () => {
  const context = { component: {}, path: '', value: null };

  it('should be instance of Validator', () => {
    const validator = pick('test', custom(() => false));
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should pick sub property', () => {
    const value = { test: { a: 1, b: 2 } };

    const validator = pick('test', custom((val) => {
      expect(val).to.equal(value.test);
      return false;
    }));

    validator.hasError(value, context);
  })

  it('should return error if sub property dont exist', () => {
    const value = { test: { a: 1, b: 2 } };

    const validator = pick('test2', custom(() => false));

    expect(validator.hasError(value, context)).to.eql(['UNKNOW_PROPERTY']);
  })

  it('should return error if obj is null', () => {
    const value = null;

    const validator = pick('test2', custom(() => false));

    expect(validator.hasError(value, context)).to.eql(['UNKNOW_PROPERTY']);
  })
});
