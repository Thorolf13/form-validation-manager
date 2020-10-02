import { describe, it } from "mocha"
import { expect, assert } from "chai";
import { eq, async } from "../../src";
import { ValidationGroup } from "../../src/fvm/validation";
import { HasErrorCallbackReturn, HasErrorAsyncCallback } from '../../src/validators/validator'


function externalPromise() {
  let $resolve: any = null;
  let $reject: any = null

  const $promise = new Promise<HasErrorCallbackReturn>((resolve, reject) => { $resolve = resolve; $reject = reject });

  return {
    $resolve,
    $reject,
    callback: (value: any, context: any) => $promise
  } as {
    $resolve: (v: HasErrorCallbackReturn) => void,
    $reject: (err: any) => void,
    callback: HasErrorAsyncCallback
  };
}

function sleep(nb?: number) {
  return new Promise(resolve => { setTimeout(() => resolve(), nb) })
}

describe('test validation', () => {


  const component = {
    form: {
      val1: 0,
      val2: 0
    },
    $watch: () => { }
  }

  it('should build validation tree', () => {
    const p1 = externalPromise();
    const p2 = externalPromise();

    const validators = {
      form: {
        val1: async(p1.callback),
        val2: async(p2.callback)
      }
    };

    const validation = new ValidationGroup(validators, '', component)

    assert.isDefined(validation.children.form);
    assert.isDefined(validation.children.form.children);
    assert.isDefined(validation.children!.form.children!.val1);
    assert.isDefined(validation.children!.form.children!.val2);
  })

  it('should manage async validation OK', async () => {
    const p1 = externalPromise();
    const p2 = externalPromise();

    const validators = {
      form: {
        val1: async(p1.callback),
        val2: async(p2.callback)
      }
    };

    const validation = new ValidationGroup(validators, '', component)

    expect(validation.$pending).to.equal(true);
    expect(validation.children!.form.children!.val1.$pending).to.equal(true);
    expect(validation.children!.form.children!.val2.$pending).to.equal(true);

    p1.$resolve(false);
    await sleep(50)

    expect(validation.$pending).to.equal(true);
    expect(validation.children!.form.children!.val1.$pending).to.equal(false);
    expect(validation.children!.form.children!.val2.$pending).to.equal(true);

    p2.$resolve(false);
    await sleep(50)

    expect(validation.$pending).to.equal(false);
    expect(validation.children!.form.children!.val1.$pending).to.equal(false);
    expect(validation.children!.form.children!.val2.$pending).to.equal(false);
  })

  it('should manage async validation KO', async () => {
    const p1 = externalPromise();
    const p2 = externalPromise();

    const validators = {
      form: {
        val1: async(p1.callback),
        val2: async(p2.callback)
      }
    };

    const validation = new ValidationGroup(validators, '', component)

    expect(validation.$pending).to.equal(true);
    expect(validation.children!.form.children!.val1.$pending).to.equal(true);
    expect(validation.children!.form.children!.val2.$pending).to.equal(true);

    p1.$resolve(false);
    await sleep(50)

    expect(validation.$pending).to.equal(true);
    expect(validation.children!.form.children!.val1.$pending).to.equal(false);
    expect(validation.children!.form.children!.val2.$pending).to.equal(true);

    p2.$resolve(true);
    await sleep(50)

    expect(validation.$pending).to.equal(false);
    expect(validation.children!.form.children!.val1.$pending).to.equal(false);
    expect(validation.children!.form.children!.val2.$pending).to.equal(false);

    expect(validation.$error).to.equal(true);
    expect(validation.children!.form.children!.val1.$error).to.equal(false);
    expect(validation.children!.form.children!.val2.$error).to.equal(true);

  })
})