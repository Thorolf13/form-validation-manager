import { not, eq } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('not validator', () => {
  const validator = not(eq(1));
  const context = { component: {}, path: '', value: null };

  it('should be instance of Validator', () => {

    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError(0, context)).to.equal(false)
  })

  it('should be KO', () => {
    expect(validator.isValid(1, context)).to.equal(false)
  })
});
