/**
 * @jest-environment jsdom
 */

import { mount as mountVue2 } from '@vue/test-utils-vue2'
import { mount as mountVue3 } from '@vue/test-utils'

function itVue23 (name: string, fn: (mount: (typeof mountVue3)) => void, timeout?: number): void {
  test('[Vue2] ' + name, () => fn(mountVue2 as any));
  test('[Vue3] ' + name, () => fn(mountVue3));
}

export { itVue23 };
