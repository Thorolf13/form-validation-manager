import { describe, it } from "mocha"
import { expect, assert } from "chai";
import { eq, length } from "../../src";
import { Fvm } from "../../src/fvm/fvm";
import { Component } from "../../src/vue-integration/component";
import { mount } from "@vue/test-utils";
import { ComponentMock } from "./component-mock";



function sleep (nb?: number) {
  return new Promise<void>(resolve => { setTimeout(() => resolve(), nb) })
}

describe('fvm', () => {


  it('should build validation tree', () => {
    const validators = {
      form: {
        val: eq(5),
        arr: {
          $self: length(eq(2)),
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
    });

    const fvm = new Fvm(component, validators);
    fvm.buildValidationTree();
    const validation = fvm.getPublicApi();

    if (validation) {
      assert.isDefined(validation.form);
      assert.isDefined(validation.form.val);
      assert.isDefined(validation.form.arr);
      assert.isDefined(validation.form.arr.$self);
      assert.isDefined(validation.form.arr.$each);
      assert.isDefined(validation.form.arr.$each[0]);
      assert.isDefined(validation.form.arr.$each[0].val);
      assert.isDefined(validation.form.arr.$each[1]);
      assert.isDefined(validation.form.arr.$each[1].val);

      assert.isFalse(validation.form.arr.$self.$error);
      assert.isTrue(validation.form.arr.$each[0].val.$error);
      assert.isFalse(validation.form.arr.$each[1].val.$error);
    } else {
      assert.fail('validaion is null');
    }

  })


  it('should fire events', async () => {
    const component = new ComponentMock({
      form: {
        val1: 1,
        val2: 2
      }
    });

    const validators = {
      form: {
        val1: eq(1),
        val2: eq(1)
      }
    }

    const fvm = new Fvm(component, validators);
    fvm.buildValidationTree();
    const validations = fvm.getPublicApi();
    assert.isDefined(validations?.$events);

    const events: any[] = [];
    validations?.$events.on('done', e => events.push(e));

    await sleep(50);

    expect(events.length).to.equal(2)

  })

})
