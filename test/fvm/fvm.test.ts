import { describe, it } from "mocha"
import { expect, assert } from "chai";
import { eq } from "../../src";
import Fvm from "../../src/fvm/fvm";



function sleep(nb?: number) {
  return new Promise(resolve => { setTimeout(() => resolve(), nb) })
}

describe('fvm', () => {

  const watchersCallback: any = {};


  it('should build validation tree', () => {
    const validators = {
      form: {
        arr: {
          $each: {
            val: eq(1)
          }
        }
      }
    };
    const component = {
      form: {
        arr: [{ val: 0 }, { val: 1 }]
      },
      $forceUpdate: () => { },
      $watch: (path: string, cb: (o: any, n: any) => {}, options: any) => {
        watchersCallback[path] = cb;
      }
    }

    const fvm = new Fvm(component, validators, '');
    fvm.buildValidation();
    const validation = fvm.validation;

    watchersCallback['form.arr'](undefined, component.form.arr)
    if (validation) {

      assert.isDefined(validation.form);
      assert.isDefined(validation.form.arr);
      assert.isDefined(validation.form.arr.$each);
      assert.isDefined(validation.form.arr.$each[0]);
      assert.isDefined(validation.form.arr.$each[0].val);
      assert.isDefined(validation.form.arr.$each[1]);
      assert.isDefined(validation.form.arr.$each[1].val);

      assert.isTrue(validation.form.arr.$each[0].val.$error);
      assert.isFalse(validation.form.arr.$each[1].val.$error);
    } else {
      assert.fail('validaion is null');
    }

  })


  it('should fire events', async () => {
    const component = {
      form: {
        val1: 1,
        val2: 2
      },
      $forceUpdate: () => { },
      $watch: () => { }
    }

    const validators = {
      form: {
        val1: eq(1),
        val2: eq(1)
      }
    }

    const fvm = new Fvm(component, validators, '');
    fvm.buildValidation();

    assert.isDefined(fvm.validation?.$events);

    const events: any[] = [];
    fvm.validation?.$events.on('done', e => events.push(e));

    await sleep(50);

    expect(events.length).to.equal(2)

  })

})
