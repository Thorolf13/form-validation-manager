
import mixinVue2 from "./mixin-vue2";
import mixinVue3 from "./mixin-vue3";

export default {
  install (Vue: any) {

    const isVue2 = Vue.version.startsWith('2')

    if (isVue2) {
      return mixinVue2.install(Vue);
    } else {
      return mixinVue3.install(Vue);
    }
  }
}
