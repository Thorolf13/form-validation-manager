import { eq } from "../../src";
import { Validator } from "../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('eq validator', () => {
  const context = { component: {}, path: '' };

  it('should be instabnce of Validator', () => {
    const validator = eq(15);
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(eq(null).hasError(null, context)).to.equal(false);
    expect(eq(undefined).hasError(undefined, context)).to.equal(false);
    expect(eq(false).hasError(false, context)).to.equal(false);
    expect(eq(true).hasError(true, context)).to.equal(false);
    expect(eq(1).hasError(1, context)).to.equal(false);
    expect(eq('a').hasError('a', context)).to.equal(false);
  });

  it('should be OK, strict mode = false', () => {
    expect(eq(null, false).hasError(undefined, context)).to.equal(false);
    expect(eq(undefined, false).hasError(null, context)).to.equal(false);
    expect(eq(1, false).hasError('1', context)).to.equal(false);
    expect(eq(false, false).hasError('0', context)).to.equal(false);
    expect(eq(false, false).hasError('', context)).to.equal(false);
    expect(eq(false, false).hasError(0, context)).to.equal(false);
    expect(eq(true, false).hasError(1, context)).to.equal(false);
    expect(eq(true, false).hasError('1', context)).to.equal(false);
  });

  it('should be KO', () => {
    expect(eq(null).isValid(undefined, context)).to.equal(false);
    expect(eq(undefined).isValid(null, context)).to.equal(false);
    expect(eq(1).isValid('1', context)).to.equal(false);
    expect(eq('a').isValid(1, context)).to.equal(false);
  });
});