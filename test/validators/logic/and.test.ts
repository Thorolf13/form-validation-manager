import { and, required, numeric, eq } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('and validator', () => {
  const validator = and(required(), numeric(), eq(0));
  const context = { component: {}, path: '' };

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError(0, context)).to.equal(false)
  })

  it('should be KO', () => {
    expect(validator.hasError(1, context)).to.eql(['EQ_ERROR'])
    expect(validator.hasError('a', context)).to.eql(['NOT_NUMERIC', 'EQ_ERROR'])
    expect(validator.hasError(null, context)).to.eql(['NULL_UNDEFINED', 'EQ_ERROR'])
  })
});