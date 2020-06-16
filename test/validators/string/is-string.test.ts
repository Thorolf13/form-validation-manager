import { isString } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('is-string validator', () => {
  const context = { component: {}, path: '' };
  const validator = isString();

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError('', context)).to.equal(false);
    expect(validator.hasError('a', context)).to.equal(false);
    expect(validator.hasError(null, context)).to.equal(false);
    expect(validator.hasError(undefined, context)).to.equal(false);
  });

  it('should be KO', () => {
    expect(validator.isValid(1, context)).to.equal(false);
    expect(validator.isValid({}, context)).to.equal(false);
  });
});