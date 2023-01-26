import { andSequence, required, numeric, eq, custom } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect, assert } from "chai";


describe('andSequence validator', () => {

  const context = { component: {}, path: '', value: null };

  it('should be instance of Validator', () => {
    const validator = andSequence(required(), numeric(), eq(0));
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    const validator = andSequence(required(), numeric(), eq(0));
    expect(validator.hasError(0, context)).to.equal(false)
  })

  it('should be KO - error at 3rd validator', () => {
    const validator = andSequence(
      custom(() => false),
      custom(() => false),
      custom(() => true)
    );
    expect(validator.isValid(1, context)).to.eql(false)
  })

  it('should be KO - error at 2nd validator', () => {
    const validator = andSequence(
      custom(() => false),
      custom(() => true),
      custom(() => {
        assert.fail('should never be called');
        return true;
      })
    );
    expect(validator.isValid(1, context)).to.eql(false)
  })

  it('should be KO - error at 21stnd validator', () => {
    const validator = andSequence(
      custom(() => true),
      custom(() => {
        assert.fail('should never be called');
        return true;
      }),
      custom(() => {
        assert.fail('should never be called');
        return true;
      })
    );
    expect(validator.isValid(1, context)).to.eql(false)
  })
});
