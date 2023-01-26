import { and, required, numeric, eq } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('and validator', () => {
  const validator = and(required(), numeric(), eq(0));
  const context = { component: {}, path: 'val1', value: null };

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError(0, context)).to.equal(false)
  })

  it('should be KO', () => {
    expect(validator.hasError(1, context)).to.eql(['val1[EQ_ERROR]'])
    expect(validator.hasError('a', context)).to.eql(['val1[NUMERIC_ERROR]', 'val1[EQ_ERROR]'])
    expect(validator.hasError(null, context)).to.eql(['val1[NULL_UNDEFINED]', 'val1[EQ_ERROR]'])
  })
});
