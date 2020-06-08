import { required } from "../../src";
import { Validator } from "../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('required validator', () => {
  const validator = required();
  const context = { component: {}, path: '' };

  it('should be instabnce of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError('a', context)).to.equal(false);
    expect(validator.hasError(0, context)).to.equal(false);
    expect(validator.hasError([1], context)).to.equal(false);
    expect(validator.hasError({ a: 1 }, context)).to.equal(false);
  });

  it('should be KO', () => {
    expect(validator.isValid(null, context)).to.equal(false);
    expect(validator.isValid(undefined, context)).to.equal(false);
    expect(validator.isValid('', context)).to.equal(false);
    expect(validator.isValid([], context)).to.equal(false);
    expect(validator.isValid({}, context)).to.equal(false);
  });
});