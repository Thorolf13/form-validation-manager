import { async } from "../../../src";
import { AsyncValidator, HasErrorCallbackReturn, Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";



function sleep(nb?: number) {
  return new Promise(resolve => { setTimeout(() => resolve(), nb) })
}

describe('async validator', () => {
  const component = { a: 15, $forceUpdate: () => { } };
  const context = { component, path: '' };

  it('should be instance of Validator', () => {
    const validator = async(function () { return new Promise(() => { }) });
    expect(validator instanceof AsyncValidator).to.equal(true)
  })

  it('should call callback with component as \'this\'', () => {
    const validator = async(function (value, ctx) {
      expect(this).to.equal(ctx.component)
      expect(this).to.equal(component)
      return new Promise(() => { })
    });
    validator.hasError(1, context);
  })

  it('should be OK', () => {
    async(() => new Promise(resolve => resolve(false))).hasError(1, context).then(response => expect(response).to.equal(false));
    async(() => new Promise(resolve => resolve([]))).hasError(1, context).then(response => expect(response).to.equal(false));
    async(() => new Promise(resolve => resolve(null as any))).hasError(1, context).then(response => expect(response).to.equal(false));
    async(() => new Promise(resolve => resolve(undefined as any))).hasError(1, context).then(response => expect(response).to.equal(false));
  })

  it('should be KO', () => {
    async(() => new Promise(resolve => resolve(true))).hasError(1, context).then(response => expect(response).to.eql(['ASYNC_ERROR']));
    async(() => new Promise(resolve => resolve([true, false]))).hasError(1, context).then(response => expect(response).to.eql(['ASYNC_ERROR']));
    async(() => new Promise(resolve => resolve('TEST'))).hasError(1, context).then(response => expect(response).to.eql(['TEST']));
    async(() => new Promise(resolve => resolve(['TEST1', 'TEST2']))).hasError(1, context).then(response => expect(response).to.eql(['TEST1', 'TEST2']));
    async(() => new Promise(resolve => resolve(['TEST1', 'TEST2', false, true]))).hasError(1, context).then(response => expect(response).to.eql(['TEST1', 'TEST2']));
  })

  it('should debounce multiples calls', async () => {
    const expectedCallsValues = [2, 5];

    const validator = async(function (value, ctx) {
      expect(value).to.equal(expectedCallsValues.shift());

      return new Promise(() => { })
    }, false, 100);


    validator.hasError(1, context);
    validator.hasError(2, context);

    await sleep(300)

    validator.hasError(3, context);
    await sleep(80);
    validator.hasError(4, context);
    await sleep(80);
    validator.hasError(5, context);
  })

});