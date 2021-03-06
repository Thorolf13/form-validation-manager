import { gt } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('gt validator', () => {
  const validator = gt(15);
  const context = { component: {}, path: '' };

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError(15.00000000001, context)).to.equal(false);
    expect(validator.hasError(20, context)).to.equal(false);
    expect(validator.hasError(Infinity, context)).to.equal(false);
  });

  it('should be KO', () => {
    expect(validator.isValid(15, context)).to.equal(false);
    expect(validator.isValid(-Infinity, context)).to.equal(false);
    expect(validator.isValid('a', context)).to.equal(false);
    expect(validator.isValid(null, context)).to.equal(false);
  });
});