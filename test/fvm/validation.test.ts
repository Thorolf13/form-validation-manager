import { describe, it } from "mocha"
import { expect, assert } from "chai";
import { eq } from "../../src";
import { ValidationGroup } from "../../src/fvm/validation";


describe('test validation', () => {

  const validators = {
    form: {
      cat1: {
        val1: eq(1),
        val2: eq(1)
      },
      cat2: {
        val3: eq(1),
        val4: eq(1),
      }
    }
  };
  const component = {
    form: {
      cat1: {
        val1: 1,
        val2: 0
      },
      cat2: {
        val3: 0,
        val4: 0
      }
    },
    $watch: () => { }
  }

  it('should build validation tree', () => {
    const validation = new ValidationGroup(validators, '', component)

    assert.isDefined(validation.children.form);
    assert.isDefined(validation.children.form.children);
    assert.isDefined(validation.children!.form.children!.cat1);
    assert.isDefined(validation.children!.form.children!.cat1.children);
    assert.isDefined(validation.children!.form.children!.cat1.children!.val1);
    assert.isDefined(validation.children!.form.children!.cat1.children!.val2);
    assert.isDefined(validation.children!.form.children!.cat2);
    assert.isDefined(validation.children!.form.children!.cat2.children);
    assert.isDefined(validation.children!.form.children!.cat2.children!.val3);
    assert.isDefined(validation.children!.form.children!.cat2.children!.val4);
  })


  it('should cascade children errors to parents', () => {
    const validation = new ValidationGroup(validators, '', component)

    expect(validation.children!.form.children!.cat1.children!.val1.$errors).to.eql([]);
    expect(validation.children!.form.children!.cat1.children!.val1.$error).to.equal(false);
    expect(validation.children!.form.children!.cat1.children!.val1.$invalid).to.equal(false);
    expect(validation.children!.form.children!.cat1.children!.val1.$isValid).to.equal(true);
    expect(validation.children!.form.children!.cat1.children!.val1.$valid).to.equal(true);
    expect(validation.children!.form.children!.cat1.children!.val1.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat1.children!.val1.$pristine).to.equal(true);

    expect(validation.children!.form.children!.cat1.children!.val2.$errors).to.eql(['EQ_ERROR']);
    expect(validation.children!.form.children!.cat1.children!.val2.$error).to.equal(true);
    expect(validation.children!.form.children!.cat1.children!.val2.$invalid).to.equal(true);
    expect(validation.children!.form.children!.cat1.children!.val2.$isValid).to.equal(false);
    expect(validation.children!.form.children!.cat1.children!.val2.$valid).to.equal(false);
    expect(validation.children!.form.children!.cat1.children!.val2.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat1.children!.val2.$pristine).to.equal(true);

    expect(validation.children!.form.children!.cat1.$errors).to.eql(['EQ_ERROR']);
    expect(validation.children!.form.children!.cat1.$error).to.equal(true);
    expect(validation.children!.form.children!.cat1.$invalid).to.equal(true);
    expect(validation.children!.form.children!.cat1.$isValid).to.equal(false);
    expect(validation.children!.form.children!.cat1.$valid).to.equal(false);
    expect(validation.children!.form.children!.cat1.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat1.$pristine).to.equal(true);

    expect(validation.children!.form.children!.cat2.children!.val3.$errors).to.eql(['EQ_ERROR']);
    expect(validation.children!.form.children!.cat2.children!.val3.$error).to.equal(true);
    expect(validation.children!.form.children!.cat2.children!.val3.$invalid).to.equal(true);
    expect(validation.children!.form.children!.cat2.children!.val3.$isValid).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val3.$valid).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val3.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val3.$pristine).to.equal(true);

    expect(validation.children!.form.children!.cat2.children!.val4.$errors).to.eql(['EQ_ERROR']);
    expect(validation.children!.form.children!.cat2.children!.val4.$error).to.equal(true);
    expect(validation.children!.form.children!.cat2.children!.val4.$invalid).to.equal(true);
    expect(validation.children!.form.children!.cat2.children!.val4.$isValid).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val4.$valid).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val4.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val4.$pristine).to.equal(true);

    expect(validation.children!.form.children!.cat2.$errors).to.eql(['EQ_ERROR', 'EQ_ERROR']);
    expect(validation.children!.form.children!.cat2.$error).to.equal(true);
    expect(validation.children!.form.children!.cat2.$invalid).to.equal(true);
    expect(validation.children!.form.children!.cat2.$isValid).to.equal(false);
    expect(validation.children!.form.children!.cat2.$valid).to.equal(false);
    expect(validation.children!.form.children!.cat2.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat2.$pristine).to.equal(true);

    expect(validation.children!.form.$errors).to.eql(['EQ_ERROR', 'EQ_ERROR', 'EQ_ERROR']);
    expect(validation.children!.form.$error).to.equal(true);
    expect(validation.children!.form.$invalid).to.equal(true);
    expect(validation.children!.form.$isValid).to.equal(false);
    expect(validation.children!.form.$valid).to.equal(false);
    expect(validation.children!.form.$dirty).to.equal(false);
    expect(validation.children!.form.$pristine).to.equal(true);

    expect(validation.$errors).to.eql(['EQ_ERROR', 'EQ_ERROR', 'EQ_ERROR']);
    expect(validation.$error).to.equal(true);
    expect(validation.$invalid).to.equal(true);
    expect(validation.$isValid).to.equal(false);
    expect(validation.$valid).to.equal(false);
    expect(validation.$dirty).to.equal(false);
    expect(validation.$pristine).to.equal(true);
  })

  it('should cascade set as dirty', () => {
    const validation = new ValidationGroup(validators, '', component)

    expect(validation.children!.form.children!.cat1.children!.val1.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat1.children!.val1.$pristine).to.equal(true);
    expect(validation.children!.form.children!.cat1.children!.val2.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat1.children!.val2.$pristine).to.equal(true);
    expect(validation.children!.form.children!.cat1.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat1.$pristine).to.equal(true);
    expect(validation.children!.form.children!.cat2.children!.val3.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val3.$pristine).to.equal(true);
    expect(validation.children!.form.children!.cat2.children!.val4.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val4.$pristine).to.equal(true);
    expect(validation.children!.form.children!.cat2.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat2.$pristine).to.equal(true);
    expect(validation.children!.form.$dirty).to.equal(false);
    expect(validation.children!.form.$pristine).to.equal(true);
    expect(validation.$dirty).to.equal(false);
    expect(validation.$pristine).to.equal(true);

    validation.children!.form.children!.cat1.$dirty = true;

    //must be modified
    expect(validation.children!.form.children!.cat1.children!.val1.$dirty).to.equal(true);
    expect(validation.children!.form.children!.cat1.children!.val1.$pristine).to.equal(false);
    expect(validation.children!.form.children!.cat1.children!.val2.$dirty).to.equal(true);
    expect(validation.children!.form.children!.cat1.children!.val2.$pristine).to.equal(false);
    expect(validation.children!.form.children!.cat1.$dirty).to.equal(true);
    expect(validation.children!.form.children!.cat1.$pristine).to.equal(false);
    //must be untouched
    expect(validation.children!.form.children!.cat2.children!.val3.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val3.$pristine).to.equal(true);
    expect(validation.children!.form.children!.cat2.children!.val4.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat2.children!.val4.$pristine).to.equal(true);
    expect(validation.children!.form.children!.cat2.$dirty).to.equal(false);
    expect(validation.children!.form.children!.cat2.$pristine).to.equal(true);
    //must be modified
    expect(validation.children!.form.$dirty).to.equal(true);
    expect(validation.children!.form.$pristine).to.equal(false);
    expect(validation.$dirty).to.equal(true);
    expect(validation.$pristine).to.equal(false);
  })

})