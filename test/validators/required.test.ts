import { required } from "../../src";
import { Validator } from "../../src/validators/validator";

import { describe, it } from "mocha";
import { expect } from "chai";


describe('required validator', () => {
  const validator = required();
  const context = { component: {}, path: '', value: null };

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true);
  });

  it('should be OK', () => {
    expect(validator.hasError('a', context)).to.equal(false);
    expect(validator.hasError(0, context)).to.equal(false);
    expect(validator.hasError([1], context)).to.equal(false);
    expect(validator.hasError({ a: 1 }, context)).to.equal(false);
    expect(validator.hasError(new Date(), context)).to.equal(false);
  });

  it('should be KO', () => {
    expect(validator.hasError(null, context)).to.not.equal(false);
    expect(validator.hasError(undefined, context)).to.not.equal(false);
    expect(validator.hasError('', context)).to.not.equal(false);
    expect(validator.hasError([], context)).to.not.equal(false);
    expect(validator.hasError({}, context)).to.not.equal(false);
  });
});
