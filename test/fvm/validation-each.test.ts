import { describe, it } from "mocha"
import { assert } from "chai";
import { eq } from "../../src";
import { EventsList } from "../../src/fvm/types";
import { EventEmitter } from "../../src/commons/event";
import { ValidationGroup } from "../../src/fvm/validation/validation-group";
import { ComponentMock } from "./component-mock";


describe('validation $each', () => {
  const validators = {
    form: {
      arr: {
        $each: {
          val: eq(1)
        }
      }
    }
  };
  const component = new ComponentMock({
    form: {
      arr: [{ val: 0 }, { val: 1 }]
    }
  })
  const events = new EventEmitter<EventsList>();

  it('should build validation tree', () => {
    const validation = new ValidationGroup(validators, '', component, events)

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

    assert.isTrue(validation.children!.form.children!.arr.children!.$each.children![0].children!.val.$error);
    assert.isFalse(validation.children!.form.children!.arr.children!.$each.children![1].children!.val.$error);


  })

})
