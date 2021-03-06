import { _if, custom } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect, assert } from "chai";


describe('_if validator', () => {

  const context = { component: {}, path: '' };

  it('should be instance of Validator', () => {
    const validator = _if(() => true, custom(() => false))
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should call validator if condition is true', () => {
    const validator = _if(() => true, custom(() => 'ERR_MESSAGE'))
    expect(validator.hasError(1, context)).to.eql(['ERR_MESSAGE']);
  })

  it('should not call validator if condition is false', () => {
    const validator = _if(() => false, custom(() => {
      assert.fail('should never be called')
      return 'ERR_MESSAGE'
    }))
    expect(validator.hasError(1, context)).to.equal(false);
  })
});