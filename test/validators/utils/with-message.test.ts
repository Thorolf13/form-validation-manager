import { withMessage, eq } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('withMessage validator', () => {
  const customMessage = 'custom error message'
  const validator = withMessage(eq(0), customMessage);
  const context = { component: {}, path: '', value: null };

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError(0, context)).to.equal(false)
  })

  it('should be KO with custom message', () => {
    expect(validator.hasError(1, context)).to.eql([customMessage])
  })
});
