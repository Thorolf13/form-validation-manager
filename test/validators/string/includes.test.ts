import { includes } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('includes validator', () => {
  const context = { component: {}, path: '', value: null };


  it('should be instance of Validator', () => {
    const validator = includes('');
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(includes('b').hasError('aaabbbcccddd', context)).to.equal(false);
    expect(includes('aaa').hasError('aaabbbcccddd', context)).to.equal(false);
    expect(includes('ddd').hasError('aaabbbcccddd', context)).to.equal(false);
  });

  it('should be KO', () => {
    expect(includes('e').hasError('aaabbbcccddd', context)).to.not.equal(false);
    expect(includes(' ').hasError('aaabbbcccddd', context)).to.not.equal(false);
    expect(includes(' ').hasError('', context)).to.not.equal(false);
  });
});
