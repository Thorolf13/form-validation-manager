/**
 * @jest-environment jsdom
 */
import { mount, createLocalVue } from "@vue/test-utils"
import { eq, Fvm, gt } from "form-validation-manager";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// import { itVue23 } from "../test-vue23"
const localVue = createLocalVue()

localVue.use(Fvm)

describe('validation - options API', () => {
  it('should have no errors', async () => {
    const Component = {
      template: '<div>{{$fvm.$errors}}</div>',
      data: () => ({
        form: {
          val1: 5,
          val2: false,
          arr: [
            { val: 1 },
            { val: 2 }
          ]
        }
      }),
      validations: {
        form: {
          val1: eq(5),
          val2: eq(false)
        }
      }
    } as any

    const wrapper = mount(Component, { localVue })
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('[]')
  })

  it('should have errors on init', async () => {
    const Component = {
      template: '<div>{{$fvm.$errors}}</div>',
      data: () => ({
        form: {
          val1: 5,
          val2: false,
          arr: [
            { val: 1 },
            { val: 2 }
          ]
        }
      }),
      validations: {
        form: {
          val1: eq(1),
          val2: eq(false)
        }
      }
    } as any

    const wrapper = mount(Component, { localVue })
    await wrapper.vm.$nextTick();

    // Assert the rendered text of the component
    expect(JSON.parse(wrapper.text())).toEqual(["form.val1[EQ_ERROR]"])
  })

  it('should have errors after update', async () => {
    const Component = {
      template: '<div><input v-model="val1"/><span id="errors">{{$fvm.$errors}}</span></div>',
      data: () => ({
        val1: 5,
        val2: 5
      }),
      validations: {
        val1: eq(5)
      }
    } as any

    const wrapper = mount(Component, { localVue })
    await wrapper.vm.$nextTick();


    expect(wrapper.text()).toContain('[]');


    wrapper.setData({ val1: 1 });
    await wrapper.vm.$nextTick();

    expect(JSON.parse(wrapper.find('span').text())).toEqual(["val1[EQ_ERROR]"])
  })
})
