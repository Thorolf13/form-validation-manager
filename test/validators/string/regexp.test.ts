import { regexp } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('regexp validator', () => {
  const context = { component: {}, path: '' };


  it('should be instance of Validator', () => {
    const validator = regexp(/ /);
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(regexp(/\w{3}/).hasError('aaa', context)).to.equal(false);
  });

  it('should be KO', () => {
    expect(regexp(/\w{3}/).isValid('aa', context)).to.equal(false);
  });
});