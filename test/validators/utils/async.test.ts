import { async } from "../../../src";
import { AsyncValidator, HasErrorCallbackReturn } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('async validator', () => {
  const component = { a: 15 };
  const context = { component, path: '' };

  it('should be instance of Validator', () => {
    const validator = async(function () { return new Promise(() => { }) });
    expect(validator instanceof AsyncValidator).to.equal(true)
  })

  it('should sould call callback with component as \'this\'', () => {
    const validator = async(function (value, ctx) {
      expect(this).to.equal(ctx.component)
      expect(this).to.equal(component)
      return new Promise(() => { })
    });
    validator.hasError(1, context);
  })

  it('should sould be OK', () => {
    async(() => new Promise(resolve => resolve(false))).hasError(1, context).then(response => expect(response).to.equal(false));
    async(() => new Promise(resolve => resolve([]))).hasError(1, context).then(response => expect(response).to.equal(false));
    async(() => new Promise(resolve => resolve(null as any))).hasError(1, context).then(response => expect(response).to.equal(false));
    async(() => new Promise(resolve => resolve(undefined as any))).hasError(1, context).then(response => expect(response).to.equal(false));
  })

  it('should sould be KO', () => {
    async(() => new Promise(resolve => resolve(true))).hasError(1, context).then(response => expect(response).to.eql(['CUSTOM_ERROR']));
    async(() => new Promise(resolve => resolve([true, false]))).hasError(1, context).then(response => expect(response).to.eql(['CUSTOM_ERROR']));
    async(() => new Promise(resolve => resolve('TEST'))).hasError(1, context).then(response => expect(response).to.eql(['TEST']));
    async(() => new Promise(resolve => resolve(['TEST1', 'TEST2']))).hasError(1, context).then(response => expect(response).to.eql(['TEST1', 'TEST2']));
    async(() => new Promise(resolve => resolve(['TEST1', 'TEST2', false, true]))).hasError(1, context).then(response => expect(response).to.eql(['TEST1', 'TEST2']));
  })

});