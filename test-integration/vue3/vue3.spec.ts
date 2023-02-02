/**
 * @jest-environment jsdom
 */
import { mount } from "@vue/test-utils";
import { watch } from "vue-demi";
import { custom, eq, Fvm, revalidate } from '../../src';
// import { itVue23 } from "../test-vue23"

describe('validation - options API', () => {
  it('should have no errors', async () => {
    const Component = {
      template: '<div>{{$fvm.$errors}}</div>',
      data: () => ({
        val1: 5
      }),
      validations: {
        val1: eq(5)
      }
    } as any;

    const wrapper = mount(Component, {
      global: {
        plugins: [Fvm]
      }
    });
    await wrapper.vm.$nextTick();

    // Assert the rendered text of the component
    expect(wrapper.text()).toContain('[]');
  });

  it('should have errors on init', async () => {
    const Component = {
      template: '<div>{{$fvm.$errors}}</div>',
      data: () => ({
        val1: 5
      }),
      validations: {
        val1: eq(4)
      }
    } as any;

    const wrapper = mount(Component, {
      global: {
        plugins: [Fvm]
      }
    });
    await wrapper.vm.$nextTick();

    // Assert the rendered text of the component
    expect(JSON.parse(wrapper.text())).toEqual(["val1[EQ_ERROR]"]);
  });

  it('should have errors after update', async () => {
    const Component = {
      template: '<div>{{$fvm.$errors}}</div>',
      data: () => ({
        val1: 5
      }),
      validations: {
        val1: eq(5)
      }
    } as any;

    const wrapper = mount(Component, {
      global: {
        plugins: [Fvm]
      }
    });
    await wrapper.vm.$nextTick();


    expect(wrapper.text()).toContain('[]');

    wrapper.setData({ val1: 4 });
    await wrapper.vm.$nextTick();
    // console.log(wrapper.vm.$fvm.$errors);

    expect(JSON.parse(wrapper.text())).toEqual(["val1[EQ_ERROR]"]);
  });



  it('should revalidate', async () => {
    const Component = {
      template: '<div>{{$fvm.$errors}}</div>',
      data: () => ({
        form: {
          val1: 5,
          val2: 1
        }
      }),
      validations: {
        form: {
          val1: revalidate('form.val2'),
          val2: custom(function (v) { return v > this.form.val1 ? 'errror val2>val1' : false; })
        }
      }
    } as any;

    const wrapper = mount(Component, {
      global: {
        plugins: [Fvm]
      }
    });
    await wrapper.vm.$nextTick();


    expect(wrapper.text()).toContain('[]');

    wrapper.setData({ form: { val2: 20 } });
    await wrapper.vm.$nextTick();
    // console.log(wrapper.vm.$fvm.$errors);

    expect(JSON.parse(wrapper.text())).toEqual(["errror val2>val1"]);
  });
});
