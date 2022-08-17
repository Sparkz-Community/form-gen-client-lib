import * as components from './components';
import {
  DatePicker,
  VueNumberInput,
  VueTelInput,
} from './packages';

import 'vue-tel-input/dist/vue-tel-input.css';

const install = (Vue, {prefix} = {}) => {
  for (let key in components) {
    let _key = prefix ? prefix + key : key;
    Vue.component(_key, components[key]);
  }

  Array.prototype.insert = function (index, ...value) {
    this.splice(index, 0, ...value);
    return this;
  };

  Vue.config.globalProperties.$omitDeep = require('omit-deep');

  Vue.component('DatePicker', DatePicker);
  Vue.component('vue-number-input', VueNumberInput);
  Vue.use(VueTelInput);
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default { install };
