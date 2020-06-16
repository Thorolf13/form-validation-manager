import { empty } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('empty validator', () => {
  const validator = empty();
  const context = { component: {}, path: '' };

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError(true, context)).to.equal(false)
    expect(validator.hasError(false, context)).to.equal(false)
    expect(validator.hasError(null, context)).to.equal(false)
  })
});