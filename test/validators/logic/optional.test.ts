import { optional, custom } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect, assert } from "chai";


describe('optional validator', () => {

  const context = { component: {}, path: '' };

  it('should be instance of Validator', () => {
    const validator = optional(custom(() => 'ERR_MESSAGE'));
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should call validator if value is defined', () => {
    const validator = optional(custom(() => 'ERR_MESSAGE'));
    expect(validator.hasError(1, context)).to.eql(['ERR_MESSAGE']);
  })

  it('should not call validator if condition is false', () => {
    const validator = optional(custom(() => {
      assert.fail('should never be called')
      return 'ERR_MESSAGE'
    }))
    expect(validator.hasError(null, context)).to.equal(false);
    expect(validator.hasError(undefined, context)).to.equal(false);
    expect(validator.hasError("", context)).to.equal(false);
  })
});