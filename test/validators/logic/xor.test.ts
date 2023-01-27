import { xor, pick, eq } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('xor validator', () => {
  const validator = xor(pick('a', eq(1)), pick('b', eq(1)), pick('c', eq(1)));
  const context = { component: {}, path: '', value: null };

  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(validator.hasError({ a: 1, b: 2, c: 2 }, context)).to.equal(false);
    expect(validator.hasError({ a: 2, b: 1, c: 2 }, context)).to.equal(false);
    expect(validator.hasError({ a: 2, b: 2, c: 1 }, context)).to.equal(false);
  })

  it('should be KO', () => {
    expect(validator.hasError({ a: 1, b: 1, c: 1 }, context)).to.not.equal(false);
    expect(validator.hasError({ a: 1, b: 1, c: 2 }, context)).to.not.equal(false);
    expect(validator.hasError({ a: 1, b: 2, c: 1 }, context)).to.not.equal(false);
    expect(validator.hasError({ a: 2, b: 1, c: 1 }, context)).to.not.equal(false);
  })
});
