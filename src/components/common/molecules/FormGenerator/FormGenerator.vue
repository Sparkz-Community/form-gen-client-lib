<template>
  <component :is="useQform ? 'q-form' : 'div'" id="FormGenerator" v-bind="attrs['row-attrs']">
    <component v-for="(field, index) in ordered_fields"
               :key="index"
               :index="index"
               :is="field['fieldType']"
               :modelValue="getValue(field)"
               @update:modelValue="updateForm(field, $event)"
               v-bind="field">
      <template v-for="slot in ifFormsetGen(field['fieldType']) ? Object.keys($slots) : field['slots']"
                v-slot:[slot]="slotProps">
        <slot :name="slot" v-bind="slotProps"></slot>
      </template>
    </component>
  </component>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import TextInput from '../../atoms/TextInput/TextInput.vue';
  import EditorInput from '../../atoms/EditorInput/EditorInput.vue';
  import PhoneInput from '../../atoms/PhoneInput/PhoneInput.vue';
  import NumberInput from '../../atoms/NumberInput/NumberInput.vue';
  import SelectInput from '../../atoms/SelectInput/SelectInput.vue';
  import ImageSelect from '../../atoms/ImageSelect/ImageSelect.vue';
  import CtkDatePicker from '../../atoms/CtkDatePicker/CtkDatePicker.vue';
  import ColorPicker from '../../atoms/ColorPicker/ColorPicker.vue';
  import ColorSelectorRoundInput from '../../atoms/ColorSelectorRoundInput/ColorSelectorRoundInput.vue';
  import ToggleMe from '../../atoms/ToggleMe/ToggleMe.vue';

  export default {
    name: 'FormGenerator',
    inheritAttrs: false,
    components: {
      TextInput,
      EditorInput,
      PhoneInput,
      NumberInput,
      SelectInput,
      ImageSelect,
      CtkDatePicker,
      ColorPicker,
      ColorSelectorRoundInput,
      ToggleMe,
    },
    beforeCreate() {
      this.$options.components.FormsetGenerator = require('../../substance/FormsetGenerator/FormsetGenerator.vue').default;
      this.$options.components.LoginForm = require('../../../templates/LoginForm/LoginForm.vue').default;
      this.$options.components.RegisterForm = require('../../../templates/RegisterForm/RegisterForm.vue').default;
      // this.$options.components.FormCrudTable = require('../../substance/FormCrudTable/FormCrudTable.vue').default;


      // // Pull in all components from FORM_GEN_COMPONENTS env variable
      // this.$lget(process.env, 'FORM_GEN_COMPONENTS', []).forEach(component => {
      //   if (component['name'] && component['path']) {
      //     this.$options.components[component['name']] = require(`${component['path']}`).default;
      //   }
      // });


      // Pull in all components from formGeneratorCustom folder
      try {
        const requireModules = require.context(
          // The path where the service modules live
          'src/components/formGeneratorCustom',
          // Whether to look in subfolders
          true,
          // Only include .js files (prevents duplicate imports`)
          /.vue$/,
        );
        requireModules.keys().forEach(modulePath => {
          const componentName = this.$lupperFirst(
            this.$lcamelCase(
              // Gets the file name regardless of folder depth
              modulePath
                .split('/')
                .pop()
                .replace(/\.\w+$/, ''),
            ),
          );
          this.$options.components[componentName] = requireModules(modulePath).default;
        });
      } catch (err) {
        // console.log('requireModules formGeneratorCustom Error:', err);
      }
    },
    created() {
      // Pull in all components from customComponents props
      this.$lget(this, 'customComponents', []).forEach(async component => {
        if (typeof component === 'function') {
          let comp = await component();
          this.$options.components[comp['name']] = comp;
        } else {
          this.$options.components[component['name']] = component;
        }
      });
    },
    props: {
      fields: {
        type: Array,
        required: true,
      },
      modelValue: {
        required: true,
      },
      useQform: {
        type: Boolean,
        required: false,
        default: false,
      },
      valid: {
        type: Boolean,
        required: false,
        default: false,
      },
      customComponents: {
        type: Array,
        required: false,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        formData: {},
        oldVal: undefined,
      };
    },
    mounted() {
      if (this.useQform) {
        let refQform = this.$refs[this.$lget(this.attrs, 'row-attrs.ref', 'qForm')];
        if (refQform) {
          this.$emit('refQForm', refQform);
        }
      }
    },
    watch: {
      modelValue: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          // console.log('Old: ', JSON.stringify(this.oldVal), 'New: ', JSON.stringify(newVal));
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(this.oldVal)) {
            this.formData = this.$lcloneDeep(newVal);
            this.oldVal = this.$lcloneDeep(newVal);

            if (this.useQform) {
              this.$nextTick(async function () {
                let refQform = this.$refs[this.$lget(this.attrs, 'row-attrs.ref', 'qForm')];
                if (refQform) {
                  this.$emit('update:valid', await refQform.validate());
                }
              });
            }
          }
        },
      },
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // row-attrs defaults
        this.$lset(newVal, 'row-attrs.class', this.$lget(newVal, 'row-attrs.class', 'row q-col-gutter-sm'));
        if (this.useQform) {
          this.$lset(newVal, 'row-attrs.ref', this.$lget(newVal, 'row-attrs.ref', 'qForm'));
          this.$lset(newVal, 'row-attrs.no-error-focus', this.$lget(newVal, 'row-attrs.no-error-focus', true));
        }
        return newVal;
      },
      ordered_fields() {
        let ordered_fields = [];
        let fields = this.fields.filter(field => !Object.keys(field).includes('index'))
          .concat(this.$lorderBy(this.fields.filter(field => Object.keys(field).includes('index')), ['index'], ['asc']));
        fields.forEach(field => {
          if (Object.keys(field).includes('index')) {
            ordered_fields.insert(field['index'], field);
          } else {
            ordered_fields.push(field);
          }
        });
        return ordered_fields.length > 0 ? ordered_fields : this.fields;
      },
    },
    methods: {
      // wrapListeners(field) {
      //   let listeners = {};
      //   Object.keys(this.listeners).forEach(listenerKey => {
      //     listeners[listenerKey] = (...args) => {
      //       if (field.return_object_no_key) {
      //         this.listeners[listenerKey](...args);
      //       } else {
      //         this.listeners[listenerKey](field.path, ...args);
      //       }
      //     };
      //   });
      //   return listeners;
      // },
      ifFormsetGen(fileType) {
        // if (fileType === 'FormsetGenerator' && !this.$lisEmpty(this.$scopedSlots)) {
        //   console.log('fileType', fileType);
        //   console.log('if', fileType === 'FormsetGenerator');
        //   console.log('$slots: ', Object.keys(this.$slots));
        // }
        return (fileType === 'FormsetGenerator' && !this.$lisEmpty(this.$slots));
      },
      getValue(field) {
        // console.log('getValue', this.$lget(field, 'return_object_no_key') ? this.formData : this.$lget(this.formData, field.path));
        return this.$lget(field, 'return_object_no_key') ? this.formData : this.$lget(this.formData, field.path);
      },
      updateForm(field, value) {
        // console.log('Key:', field);
        // console.log('value:', value);
        let formData = this.$lcloneDeep(this.formData);
        if (this.$lget(field, 'return_object_no_key')) {
          formData = typeof value === 'object' ? Object.assign(formData, this.$lcloneDeep(value)) : this.$lcloneDeep(value);
        } else {
          formData = this.$lcloneDeep(this.$lset(formData, field.path, value));
        }
        this.$emit('update:modelValue', formData);
      },
    },
  };
</script>

<style scoped lang="scss" src="./_FormGenerator.scss">
</style>
