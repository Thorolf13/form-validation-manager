import { describe, it } from "mocha"
import { expect, assert } from "chai";
import { async } from "../../src";
import { HasErrorCallbackReturn, HasErrorAsyncCallback } from '../../src/validators/validator'
import { EventsList } from "../../src/fvm/types";
import { EventEmitter } from "../../src/commons/event";
import { ValidationGroup } from "../../src/fvm/validation/validation-group";
import { ComponentMock } from "./component-mock";


function externalPromise () {
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

function sleep (nb?: number) {
  return new Promise<void>(resolve => { setTimeout(() => resolve(), nb) })
}

describe('async validation', () => {


  const component = new ComponentMock({
    form: {
      val1: 1,
      val2: 2
    }
  });
  const events = new EventEmitter<EventsList>();

  it('should build validation tree', () => {
    const p1 = externalPromise();
    const p2 = externalPromise();

    const validators = {
      form: {
        val1: async(p1.callback),
        val2: async(p2.callback)
      }
    };

    const validation = new ValidationGroup(validators, '', component, events)

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

    const validation = new ValidationGroup(validators, '', component, events)

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

    const validation = new ValidationGroup(validators, '', component, events)

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

  it('should fire validation events', async () => {
    const p1 = externalPromise();
    const p2 = externalPromise();

    const validators = {
      form: {
        val1: async(p1.callback),
        val2: async(p2.callback)
      }
    };

    let pendingEvents: any[] = [];
    let doneEvents: any[] = [];

    events.on('pending', e => pendingEvents.push(e));
    events.on('done', e => doneEvents.push(e));

    const validation = new ValidationGroup(validators, '', component, events)

    await sleep(50)

    expect(pendingEvents.length).to.equal(2);
    expect(doneEvents.length).to.equal(0);

    events.once('done', r => {
      expect(r.path).to.equal('form.val1');
      expect(r.value).to.equal(1);
      expect(r.response).to.equal(false);
    });
    p1.$resolve(false);
    await sleep(50)

    expect(doneEvents.length).to.equal(1);

    events.once('done', r => {
      expect(r.path).to.equal('form.val2');
      expect(r.value).to.equal(2);
      expect(r.response).to.eql(['test_error']);
    });
    p2.$resolve('test_error');
    await sleep(50)

    expect(doneEvents.length).to.equal(2);
  })
})
