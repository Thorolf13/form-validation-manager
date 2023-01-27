import { or, eq } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('or validator', () => {
  const validator = or(eq(0), eq(10));
  const context = { component: {}, path: '', value: null };

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError(0, context)).to.equal(false)
    expect(validator.hasError(10, context)).to.equal(false)
  })

  it('should be KO', () => {
    expect(validator.hasError(1, context)).to.not.eql(false)
  })
});
