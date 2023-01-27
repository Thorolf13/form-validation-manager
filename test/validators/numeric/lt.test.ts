import { lt } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('lt validator', () => {
  const validator = lt(15);
  const context = { component: {}, path: '', value: null };

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError(14.999999999, context)).to.equal(false);
    expect(validator.hasError(10, context)).to.equal(false);
    expect(validator.hasError(0, context)).to.equal(false);
    expect(validator.hasError(-30, context)).to.equal(false);
    expect(validator.hasError(-Infinity, context)).to.equal(false);
  });

  it('should be KO', () => {
    expect(validator.hasError(15, context)).to.not.equal(false);
    expect(validator.hasError(16, context)).to.not.equal(false);
    expect(validator.hasError(Infinity, context)).to.not.equal(false);
    expect(validator.hasError('a', context)).to.not.equal(false);
    expect(validator.hasError(null, context)).to.not.equal(false);
  });
});
