/**
 * @jest-environment jsdom
 */
import { mount } from "@vue/test-utils";
import { reactive } from "vue";
import { eq, length, useFvm } from '../../src';
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

        const validation = useFvm(form, {
          val1: eq(5)
        });

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

        const validation = useFvm(form, {
          val1: eq(4)
        });

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
        const validation = useFvm(form, {
          val1: eq(5)
        });

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

  it('should update when push item in array', async () => {
    const Component = {
      template: '<div>{{validation.$errors}}</div>',
      // template: '<div></div>',

      setup () {
        const form = reactive({
          arr: [
            { val1: 5 },
            { val1: 5 }
          ]
        });
        const validation = useFvm(form, {
          arr: {
            $self: length(eq(2)),
            $each: {
              val1: eq(4)
            }
          }
        });

        // console.log(validation.value.arr.$each)

        return { validation, form };
      }
    } as any;

    const wrapper = mount(Component);
    await wrapper.vm.$nextTick();


    expect(JSON.parse(wrapper.text())).toEqual(["arr.$each[0].val1[EQ_ERROR]", "arr.$each[1].val1[EQ_ERROR]"]);

    wrapper.vm.form.arr.push({ val1: 3 });
    await wrapper.vm.$nextTick();

    expect(JSON.parse(wrapper.text())).toEqual(["arr.$self[EQ_ERROR]", "arr.$each[0].val1[EQ_ERROR]", "arr.$each[1].val1[EQ_ERROR]", "arr.$each[2].val1[EQ_ERROR]"]);
  });
});
