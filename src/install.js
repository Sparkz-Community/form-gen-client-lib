import * as components from './components';
import {
  DatePicker,
  VueCtkDateTimePicker,
  VueNumberInput,
  VueTelInput,
} from './packages';

import 'vue-tel-input/dist/vue-tel-input.css';

const $omitDeep = require('omit-deep');

const install = (app, {prefix, loadComponents = true} = {}) => {
  if (loadComponents) {
    for (let key in components) {
      let _key = prefix ? prefix + key : key;
      app.component(_key, components[key]);
    }
  }

  Array.prototype.insert = function (index, ...value) {
    this.splice(index, 0, ...value);
    return this;
  };

  app.config.globalProperties.$omitDeep = $omitDeep;
  app.provide('$omitDeep', $omitDeep);

  app.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
  app.component('DatePicker', DatePicker);
  app.component('vue-number-input', VueNumberInput);
  app.use(VueTelInput);
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default { install };
