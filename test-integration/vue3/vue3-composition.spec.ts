/**
 * @jest-environment jsdom
 */
import { mount } from "@vue/test-utils";
import { reactive } from "vue";
import { eq, useFvm } from '../../src';
// import { itVue23 } from "../test-vue23"

describe('validation - composition API', () => {
  it('should have no errors', async () => {

    const Component = {
      template: '<div>{{validation.$errors}}</div>',
      // template: '<div></div>',

      setup () {
        const form = reactive({
          val1: 5
        });

        const validation = useFvm({
          val1: eq(5)
        }, form);

        // console.log('validation', validation);

        return { validation, form };
      }
    } as any;

    const wrapper = mount(Component);
    await wrapper.vm.$nextTick();

    // Assert the rendered text of the component
    expect(wrapper.text()).toContain('[]');
  });

  it('should have errors on init', async () => {
    const Component = {
      template: '<div>{{validation.$errors}}</div>',
      // template: '<div></div>',

      setup () {
        const form = reactive({
          val1: 5
        });

        const validation = useFvm({
          val1: eq(4)
        }, form);

        return { validation, form };
      }
    } as any;

    const wrapper = mount(Component);
    await wrapper.vm.$nextTick();

    // Assert the rendered text of the component
    expect(JSON.parse(wrapper.text())).toEqual(["val1[EQ_ERROR]"]);
  });

  it('should have errors after update', async () => {
    const Component = {
      template: '<div>{{validation.$errors}}</div>',
      // template: '<div></div>',

      setup () {
        const form = reactive({
          val1: 5
        });
        const validation = useFvm({
          val1: eq(5)
        }, form);

        return { validation, form };
      }
    } as any;

    const wrapper = mount(Component);
    await wrapper.vm.$nextTick();


    expect(wrapper.text()).toContain('[]');

    wrapper.vm.form.val1 = 4;
    await wrapper.vm.$nextTick();

    expect(JSON.parse(wrapper.text())).toEqual(["val1[EQ_ERROR]"]);
  });
});
