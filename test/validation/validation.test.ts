import { required } from "../../src";
import { Validator } from "../../src/validators/validator";

import { describe, it } from "mocha";
import { expect } from "chai";
import { ValidationNode } from "../../src/validation/validation-node";
import { State } from "../../src/validation/state";


describe('validation tree', () => {

  const validators = {
    a: required(),
    b: {
      c: required()
    }
    // todo array, self  
  };

  const state = new State();
  const rootNode = new ValidationNode('', null, validators, state);

  it('should build validation tree', () => {
    expect(rootNode).to.not.equal(null);
    expect(rootNode.children?.a).to.not.equal(null);
    expect(rootNode.children?.b.children?.c).to.not.equal(null);
  });


});
