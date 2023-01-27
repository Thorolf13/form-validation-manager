import { async, Validator } from "../../../src";

import { describe, it } from "mocha"
import { expect } from "chai";
import { Errors } from "../../../src/validators/validator";



function sleep (nb?: number) {
  return new Promise<void>(resolve => { setTimeout(() => resolve(), nb) })
}

describe('async validator', () => {
  const component = { a: 15, $forceUpdate: () => { } };
  const context = { component, path: '', value: null };

  it('should be instance of Validator', () => {
    const validator = async(function () { return new Promise(() => { }) });
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should call callback with component as \'this\'', () => {
    const validator = async(function (value, ctx) {
      expect(this).to.equal(ctx.component)
      expect(this).to.equal(component)
      return new Promise(() => { })
    });
    validator.hasError(1, context);
  })

  function expectPromiseErrorEqual (errors: any, expected: Errors) {
    expect(errors).to.be.instanceOf(Promise);
    (errors as any as Promise<Error>).then(response => expect(response).to.eql(expected));
  }

  it('should be OK', () => {
    expectPromiseErrorEqual(async(() => new Promise(resolve => resolve(false))).hasError(1, context), false);

    expectPromiseErrorEqual(async(() => new Promise(resolve => resolve([]))).hasError(1, context), false);
    expectPromiseErrorEqual(async(() => new Promise(resolve => resolve(null as any))).hasError(1, context), false);
    expectPromiseErrorEqual(async(() => new Promise(resolve => resolve(undefined as any))).hasError(1, context), false);
  })

  it('should be KO', () => {
    expectPromiseErrorEqual(async(() => new Promise(resolve => resolve(true))).hasError(1, context), ['ASYNC_ERROR']);
    expectPromiseErrorEqual(async(() => new Promise(resolve => resolve([true, false]))).hasError(1, context), ['ASYNC_ERROR']);
    expectPromiseErrorEqual(async(() => new Promise(resolve => resolve('TEST'))).hasError(1, context), ['TEST']);
    expectPromiseErrorEqual(async(() => new Promise(resolve => resolve(['TEST1', 'TEST2']))).hasError(1, context), ['TEST1', 'TEST2']);
    expectPromiseErrorEqual(async(() => new Promise(resolve => resolve(['TEST1', 'TEST2', false, true]))).hasError(1, context), ['TEST1', 'TEST2']);
  })

  it('should debounce multiples calls', async () => {
    const expectedCallsValues = [2, 5];

    const validator = async(function (value, ctx) {
      expect(value).to.equal(expectedCallsValues.shift());

      return new Promise(() => { })
    }, 100);


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
