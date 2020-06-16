import { describe, it } from "mocha"
import { expect, assert } from "chai";
import { eq } from "../../src";
import Fvm from "../../src/fvm/fvm";


describe('fvm', () => {

  const watchersCallback: any = {};

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

  it('should build validation tree', () => {
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
    } else {
      assert.fail('validaion is null');
    }

  })

})