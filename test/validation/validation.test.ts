import { async, custom, eq, required } from "../../src";

import { describe, it } from "mocha";
import { expect } from "chai";
import { ValidationNode } from "../../src/validation/validation-node";
import { StateMock } from "./state-mock";

function sleep (time: number = 0): Promise<void> {
  // console.log('sleep', time);
  return new Promise((resolve) => setTimeout(resolve, time));
}

describe('validation tree', () => {



  it('should build validation tree', () => {
    const validators = {
      a: required(),
      b: {
        c: required()
      },
      d: {
        $each: {
          e: required()
        }
      },
      f: {
        $self: required(),
        g: required()
      }
    };

    const state = new StateMock({ a: 1, b: { c: 2 }, d: [{ e: 3 }, { e: 4 }] });
    const rootNode = new ValidationNode('', null, validators, state);

    expect(rootNode).to.not.equal(undefined);
    expect(rootNode.children!.a).to.not.equal(undefined);
    expect(rootNode.children!.b.children!.c).to.not.equal(undefined);
    expect(rootNode.children!.d.children!.$each.children![0].children!.e).to.not.equal(undefined);
    expect(rootNode.children!.d.children!.$each.children![1].children!.e).to.not.equal(undefined);
    expect(rootNode.children!.f.children!.$self).to.not.equal(undefined);
    expect(rootNode.children!.f.children!.g).to.not.equal(undefined);


    expect(Object.keys(state.errors)).to.have.members([
      '', //root node
      'a',
      'b',
      'b.c',
      'd',
      'd.$each',
      'd.$each[0]',
      'd.$each[0].e',
      'd.$each[1]',
      'd.$each[1].e',
      'f',
      'f.$self',
      'f.g'
    ]);
  });

  it('should dynamicly rebuild validation tree when array changes', () => {
    const validators = {
      a: {
        $each: {
          b: required()
        }
      }
    };

    const componentState = { a: [{ b: 1 }, { b: 2 }] };
    const state = new StateMock(componentState);
    const rootNode = new ValidationNode('', null, validators, state);

    expect(rootNode).to.not.equal(undefined);
    expect(rootNode.children!.a.children!.$each.children![0].children!.b).to.not.equal(undefined);
    expect(rootNode.children!.a.children!.$each.children![1].children!.b).to.not.equal(undefined);
    expect(rootNode.children!.a.children!.$each.children![2]).to.equal(undefined);

    componentState.a.push({ b: 3 });
    state.triggerWatch('a', componentState.a, [{ b: 1 }, { b: 2 }]);

    expect(rootNode.children!.a.children!.$each.children![0].children!.b).to.not.equal(undefined);
    expect(rootNode.children!.a.children!.$each.children![1].children!.b).to.not.equal(undefined);
    expect(rootNode.children!.a.children!.$each.children![2].children!.b).to.not.equal(undefined);
  });

  it('should validate state', () => {
    let errorF = true;

    const validators = {
      a: eq(1),
      b: {
        c: eq(1)
      },
      d: {
        $each: {
          e: eq(1)
        }
      },
      f: {
        $self: custom(function () { return errorF; }),
        g: eq(1)
      }
    };

    const state = new StateMock({ a: 0, b: { c: 0 }, d: [{ e: 0 }, { e: 0 }], f: { g: 0 } });
    const rootNode = new ValidationNode('', null, validators, state);

    expect(rootNode.children.a.getErrors()).to.eql(['a[EQ_ERROR]']);

    expect(rootNode.children.b.children.c.getErrors()).to.eql(['b.c[EQ_ERROR]']);
    expect(rootNode.children.b.getErrors()).to.eql(['b.c[EQ_ERROR]']);

    expect(rootNode.children.d.children.$each.children[0].children.e.getErrors()).to.eql(['d.$each[0].e[EQ_ERROR]']);
    expect(rootNode.children.d.children.$each.children[1].children.e.getErrors()).to.eql(['d.$each[1].e[EQ_ERROR]']);
    expect(rootNode.children.d.children.$each.getErrors()).to.eql(['d.$each[0].e[EQ_ERROR]', 'd.$each[1].e[EQ_ERROR]']);
    expect(rootNode.children.d.getErrors()).to.eql(['d.$each[0].e[EQ_ERROR]', 'd.$each[1].e[EQ_ERROR]']);

    expect(rootNode.children.f.children.$self.getErrors()).to.eql(['f.$self[CUSTOM_ERROR]']);
    expect(rootNode.children.f.children.g.getErrors()).to.eql(['f.g[EQ_ERROR]']);
    expect(rootNode.children.f.getErrors()).to.eql(['f.$self[CUSTOM_ERROR]', 'f.g[EQ_ERROR]']);

    expect(rootNode.getErrors()).to.eql(['a[EQ_ERROR]', 'b.c[EQ_ERROR]', 'd.$each[0].e[EQ_ERROR]', 'd.$each[1].e[EQ_ERROR]', 'f.$self[CUSTOM_ERROR]', 'f.g[EQ_ERROR]']);
  });

  it('should update validation', async () => {
    const validators = {
      d: {
        $each: {
          e: eq(1)
        }
      }
    };

    const computedState = { d: [{ e: 1 }, { e: 1 }] };
    const state = new StateMock(computedState);
    const rootNode = new ValidationNode('', null, validators, state);

    expect(rootNode.getErrors()).to.eql(false);

    // await sleep(100)

    computedState.d[0].e = 0;
    state.triggerWatch('d[0].e', computedState.d[0].e, 1);
    state.triggerWatch('d', computedState.d, [{ e: 0 }, { e: 1 }]);

    // await sleep(100)

    expect(rootNode.children.d.children.$each.children[0].children.e.getErrors()).to.eql(['d.$each[0].e[EQ_ERROR]']);
    expect(rootNode.getErrors()).to.eql(['d.$each[0].e[EQ_ERROR]']);
  });

  it('should update validation after async validation', async () => {

    const validators = {
      a: async((v) => new Promise(resolve => setTimeout(() => { /*console.log('execute async validation', !!v);*/ resolve(!!v); }, 100))),
    };

    const computedState = { a: 1 };
    const state = new StateMock(computedState);
    const rootNode = new ValidationNode('', null, validators, state);

    expect(rootNode.getErrors()).to.eql(false);

    await sleep(50);
    expect(rootNode.getErrors()).to.eql(false);
    expect(rootNode.getPending()).to.eql(true);

    await sleep(100);
    expect(rootNode.getErrors()).to.eql(['a[ASYNC_ERROR]']);
    expect(rootNode.getPending()).to.eql(false);

    computedState.a = 2;
    state.triggerWatch('a', 2, 1);

    await sleep(50);
    expect(rootNode.getErrors()).to.eql(false);
    expect(rootNode.getPending()).to.eql(true);

    await sleep(100);
    expect(rootNode.getErrors()).to.eql(['a[ASYNC_ERROR]']);
    expect(rootNode.getPending()).to.eql(false);

    computedState.a = 0;
    state.triggerWatch('a', 0, 2);

    await sleep(50);
    expect(rootNode.getErrors()).to.eql(false);
    expect(rootNode.getPending()).to.eql(true);

    await sleep(100);
    expect(rootNode.getErrors()).to.eql(false);
    expect(rootNode.getPending()).to.eql(false);
  });
});
