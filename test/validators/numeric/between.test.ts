import { between } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('between validator', () => {
  const context = { component: {}, path: '', value: null };

  it('should be instance of Validator', () => {
    const validator = between(5, 15);
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    const validator = between(5, 15);
    expect(validator.hasError(5, context)).to.equal(false);
    expect(validator.hasError(10, context)).to.equal(false);
    expect(validator.hasError(15, context)).to.equal(false);
  });

  it('should be OK, exclusive', () => {
    const validator = between(5, 15, true);
    expect(validator.hasError(5.00001, context)).to.equal(false);
    expect(validator.hasError(10, context)).to.equal(false);
    expect(validator.hasError(14.99999, context)).to.equal(false);
  });

  it('should be KO', () => {
    const validator = between(5, 15);
    expect(validator.isValid(4.99999, context)).to.equal(false);
    expect(validator.isValid(15.000001, context)).to.equal(false);
    expect(validator.isValid(-Infinity, context)).to.equal(false);
    expect(validator.isValid('a', context)).to.equal(false);
    expect(validator.isValid(null, context)).to.equal(false);
  });

  it('should be KO, exclusive', () => {
    const validator = between(5, 15, true);
    expect(validator.isValid(5, context)).to.equal(false);
    expect(validator.isValid(15, context)).to.equal(false);
    expect(validator.isValid(-Infinity, context)).to.equal(false);
    expect(validator.isValid('a', context)).to.equal(false);
    expect(validator.isValid(null, context)).to.equal(false);
  });
});
