import { describe, it } from "mocha"
import { expect, assert } from "chai";
import { eq } from "../../src";
import { ValidationGroup } from "../../src/fvm/validation";
import { EventEmitter } from "../../src/fvm/event";
import { EventsList } from "../../src/fvm/types";


describe('validation $each', () => {

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
  const events = new EventEmitter<EventsList>();

  it('should build validation tree', () => {
    const validation = new ValidationGroup(validators, '', component, events)
    watchersCallback['form.arr'](undefined, component.form.arr)

    assert.isDefined(validation.children.form);
    assert.isDefined(validation.children.form.children);
    assert.isDefined(validation.children!.form.children!.arr);
    assert.isDefined(validation.children!.form.children!.arr.children);
    assert.isDefined(validation.children!.form.children!.arr.children!.$each);
    assert.isDefined(validation.children!.form.children!.arr.children!.$each.children);
    assert.isDefined(validation.children!.form.children!.arr.children!.$each.children![0]);
    assert.isDefined(validation.children!.form.children!.arr.children!.$each.children![0].children);
    assert.isDefined(validation.children!.form.children!.arr.children!.$each.children![0].children!.val);
    assert.isDefined(validation.children!.form.children!.arr.children!.$each.children![1]);
    assert.isDefined(validation.children!.form.children!.arr.children!.$each.children![1].children);
    assert.isDefined(validation.children!.form.children!.arr.children!.$each.children![1].children!.val);
  })

})