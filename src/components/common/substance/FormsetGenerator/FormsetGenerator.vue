<template>
  <div id="FormsetGenerator" v-bind="attrs['div-attrs']">
    <q-card v-bind="attrs['q-card-attrs']">
      <q-card-section v-bind="attrs['card-section-attrs']">
        <label v-bind="attrs['label-attrs']">{{ label }}</label>

        <template v-for="(formFields, index) in listFormFields" :key="index">
          <transition v-bind="attrs['transition-attrs']">
            <q-card v-bind="attrs['child-q-card-attrs']" :class="{'q-mt-sm': index !== 0}">
              <q-card-section v-bind="attrs['child-card-section-attrs']">
                <div v-bind="attrs['item-header-attrs']">
                  <p v-bind="attrs['item-label-attrs']">{{ itemLabel }} {{ index + 1 }}:</p>
                  <q-space></q-space>

                  <slot name="delete-btn">
                    <q-btn v-bind="attrs['delete-btn-attrs']" @click="deleteForm(index)">
                      <q-icon v-bind="attrs['delete-icon-attrs']"></q-icon>
                    </q-btn>
                  </slot>
                </div>

                <form-generator v-bind="attrs['attrs']"
                                :fields="formFields"
                                v-model="listFormData[index]"
                                @update:modelValue="formChange"
                                useQform
                                v-model:valid="valids[index]">
                  <template v-for="slot in Object.keys($slots)"
                            v-slot:[slot]="slotProps">
                    <slot :name="slot" v-bind="slotProps"></slot>
                  </template>
                </form-generator>
              </q-card-section>
            </q-card>
          </transition>
        </template>

        <div v-bind="attrs['card-footer-attrs']">
          <q-space></q-space>

          <slot name="add-btn">
            <q-btn v-bind="attrs['add-btn-attrs']" :disable="!isValid" @click="addForm">
              <q-icon v-bind="attrs['add-icon-attrs']"/>
              <div v-bind="attrs['add-label-attrs']">{{ add_form_btn_text }}</div>
            </q-btn>
          </slot>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  import FormGenerator from '../../molecules/FormGenerator/FormGenerator.vue';

  export default {
    name: 'FormsetGenerator',
    components: {FormGenerator},
    props: {
      modelValue: {
        type: Array,
        required: false,
        default() {
          return [];
        },
      },
      templateFormFields: {
        type: Array,
        required: true,
        default() {
          return [];
        },
      },
      label: {
        type: String,
        required: true,
        default: 'Items:',
      },
      itemLabel: {
        type: String,
        required: true,
        default: 'Item',
      },
      add_form_btn_text: {
        type: String,
        required: true,
        default: 'New Form',
      },
    },
    data() {
      return {
        listFormFields: [[...this.templateFormFields]],
        listFormData: [{}],
        valids: [false],
      };
    },
    watch: {
      modelValue: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          // // eslint-disable-next-line no-console
          // console.log('Old: ', oldVal, 'New: ', newVal);
          // // eslint-disable-next-line no-console
          // console.log(typeof newVal);
          this.listFormData = newVal.length === 0 ? [{}] : newVal;

          let newList = [];
          // eslint-disable-next-line no-unused-vars
          this.listFormData.forEach(item => {
            newList.push([...this.templateFormFields]);
          });
          this.valids = Array(newList.length).fill(true);
          this.listFormFields = newList;
        },
      },
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // div-attrs defaults
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12'));

        // label-attrs defaults
        this.$lset(newVal, 'label-attrs.class', this.$lget(newVal, 'label-attrs.class', 'text-weight-bold'));

        // transition-attrs defaults
        this.$lset(newVal, 'transition-attrs.appear', this.$lget(newVal, 'transition-attrs.appear', true));
        this.$lset(newVal, 'transition-attrs.enter-active-class', this.$lget(newVal, 'transition-attrs.enter-active-class', 'animated backInLeft'));
        this.$lset(newVal, 'transition-attrs.leave-active-class', this.$lget(newVal, 'transition-attrs.leave-active-class', 'animated backOutRight'));

        // item-header-attrs defaults
        this.$lset(newVal, 'item-header-attrs.style', this.$lget(newVal, 'item-header-attrs.style', {width: '100%', display: 'flex', 'align-items': 'center'}));

        // item-label-attrs defaults
        this.$lset(newVal, 'item-label-attrs.class', this.$lget(newVal, 'item-label-attrs.class', 'q-ma-none'));

        // delete-btn-attrs defaults
        this.$lset(newVal, 'delete-btn-attrs.flat', this.$lget(newVal, 'delete-btn-attrs.flat', true));
        this.$lset(newVal, 'delete-btn-attrs.rounded', this.$lget(newVal, 'delete-btn-attrs.rounded', true));
        this.$lset(newVal, 'delete-btn-attrs.dense', this.$lget(newVal, 'delete-btn-attrs.dense', true));

        // delete-icon-attrs defaults
        this.$lset(newVal, 'delete-icon-attrs.name', this.$lget(newVal, 'delete-icon-attrs.name', 'close'));

        // card-footer-attrs defaults
        this.$lset(newVal, 'card-footer-attrs.class', this.$lget(newVal, 'card-footer-attrs.class', 'q-mt-sm'));
        this.$lset(newVal, 'card-footer-attrs.style', this.$lget(newVal, 'card-footer-attrs.style', {width: '100%', display: 'flex'}));

        // add-icon-attrs defaults
        this.$lset(newVal, 'add-icon-attrs.name', this.$lget(newVal, 'add-icon-attrs.name', 'add'));
        return newVal;
      },
      isValid() {
        return this.valids.every(item => item);
      },
    },
    methods: {
      addForm: function () {
        this.listFormFields.push([...this.templateFormFields]);
        this.listFormData.push({});
        this.valids.push(false);
      },
      deleteForm: function (index) {
        // console.log(index);
        // console.log(this.listFormFields);

        this.listFormFields.splice(index, 1);
        this.listFormData.splice(index, 1);
        this.valids.splice(index, 1);

        if (this.listFormFields.length === 0) this.addForm();
        this.formChange();
      },
      formChange() {
        this.$emit('update:modelValue', this.listFormData.filter(item => Object.keys(item).length));
      },
    },
  };
</script>

<style scoped lang="scss" src="./_FormsetGenerator.scss">
</style>

// {
//   fieldType: "FormsetGenerator",
//   label: "Phones:",
//   add_form_btn_text: "Phone",
//   name: "phones",
//   templateFormFields: [
//   {
//     fieldType: "PhoneNumberInput",
//     label: "Phone",
//     name: "phone",
//     return_object_no_key: true
//   },
//   {
//     fieldType: "SelectList",
//     label: "Type",
//     name: "phoneType",
//     multiple: false,
//     options: ["Home", "Work", "Mobile", "Other"],
//     chips: false
//   }
// ]
// },

