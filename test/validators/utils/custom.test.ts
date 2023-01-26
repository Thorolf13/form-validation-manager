import { custom } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('custom validator', () => {
  const component = { a: 15 };
  const context = { component, path: 'val1', value: null };

  it('should be instance of Validator', () => {
    const validator = custom(function () { return true });
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should sould call callback with component as \'this\'', () => {
    const validator = custom(function (value, ctx) {
      expect(this).to.equal(ctx.component)
      expect(this).to.equal(component)
      return true
    });
    validator.hasError(1, context);
  })

  it('should sould be OK', () => {
    expect(custom(() => false).hasError(1, context)).to.equal(false);
    expect(custom(() => []).hasError(1, context)).to.equal(false);
    expect(custom(() => (null as any)).hasError(1, context)).to.equal(false);
    expect(custom(() => (undefined as any)).hasError(1, context)).to.equal(false);
  })

  it('should sould be KO', () => {
    expect(custom(() => true).hasError(1, context)).to.eql(['val1[CUSTOM_ERROR]']);
    expect(custom(() => [false, true]).hasError(1, context)).to.eql(['val1[CUSTOM_ERROR]']);
    expect(custom(() => 'TEST').hasError(1, context)).to.eql(['TEST']);
    expect(custom(() => ['TEST1', 'TEST2']).hasError(1, context)).to.eql(['TEST1', 'TEST2']);
    expect(custom(() => ['TEST1', 'TEST2', false, true]).hasError(1, context)).to.eql(['TEST1', 'TEST2']);
  })

});
