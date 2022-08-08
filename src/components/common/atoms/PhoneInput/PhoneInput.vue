<template>
  <transition v-bind="attrs['transition-attrs']">
    <div id="PhoneInput" v-bind="attrs['div-attrs']">
      <q-field :modelValue="modelValue"
               v-bind="attrs['q-field-attrs']"
               @focus="$refs['phone'].focus()"
               @clear="$emit('update:modelValue', undefined)">
        <template v-slot:control>
          <vue-tel-input :name="path"
                         :modelValue="phone_number_value"
                         @on-input="getPhone"
                         ref="phone"
                         v-bind="attrs['attrs']">
            <template v-for="slot in slots" v-slot:[slot]="slotProps">
              <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
            </template>
          </vue-tel-input>
        </template>
      </q-field>
    </div>
  </transition>
</template>

<script>
  import { parsePhoneNumber } from 'awesome-phonenumber';

  export default {
    name: 'PhoneInput',
    inheritAttrs: false,
    props: {
      modelValue: {
        type: Object,
        required: false,
        default: function () {
          return {};
        },
      },
      index: {
        type: Number,
      },
      path: {
        required: true,
      },
      path_to_number: {
        type: String,
        default: 'number.input',
      },
      slots: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {};
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // attrs
        this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'Phone'));
        this.$lset(newVal, 'attrs.preferredCountries', this.$lget(newVal, 'attrs.preferredCountries', ['US', 'CA', 'MX', 'GB']));
        this.$lset(newVal, 'attrs.dynamicPlaceholder', this.$lget(newVal, 'attrs.dynamicPlaceholder', true));
        this.$lset(newVal, 'attrs.validCharactersOnly', this.$lget(newVal, 'attrs.validCharactersOnly', true));
        this.$lset(newVal, 'attrs.mode', this.$lget(newVal, 'attrs.mode', 'international'));
        this.$lset(newVal, 'attrs.style', this.$lget(newVal, 'attrs.style', 'width: 100%; height: 44px;'));
        this.$lset(newVal, 'attrs.inputId', this.$lget(newVal, 'attrs.inputId', `vue-tel-input-${this.$attrs['id'] || this.path}-${this.index}`));

        // q-field-attrs defaults
        // this.$lset(newVal, 'q-field-attrs.label', this.$lget(newVal, 'q-field-attrs.label', 'Select Icon:'));
        this.$lset(newVal, 'q-field-attrs.filled', this.$lget(newVal, 'q-field-attrs.filled', true));
        // this.$lset(newVal, 'q-field-attrs.clearable', this.$lget(newVal, 'q-field-attrs.clearable', true));
        this.$lset(newVal, 'q-field-attrs.color', this.$lget(newVal, 'q-field-attrs.color', 'secondary'));
        if (this.$lget(newVal, 'q-field-attrs.rules')) {
          this.$lset(newVal, 'q-field-attrs.rules', this.$lget(newVal, 'q-field-attrs.rules', []));
        }

        // q-field-attrs validation
        let rules = this.$lget(newVal, 'q-field-attrs.rules', []);
        let new_rule = val => {
          return val && val.length > 0 || `${this.$lget(newVal, 'q-field-attrs.label')} is required`;
        };
        if (this.$lget(newVal, 'q-field-attrs.required') && !rules.map(item => item.toString()).includes(new_rule.toString())) {
          rules.push(new_rule);
          this.$lset(newVal, 'q-field-attrs.rules', rules);
        }

        // div-attrs
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        this.$lset(
          newVal,
          'div-attrs.style',
          `display: flex; justify-content: center; flex-direction: column; ${this.$lget(newVal, 'div-attrs.style', '')}`,
        );
        return newVal;
      },
      phone_number_value() {
        return this.$lget(this.modelValue, this.path_to_number);
      },
    },
    methods: {
      // eslint-disable-next-line no-unused-vars
      getPhone(value, phone, el) {
        console.log(value, phone, el);
        let phoneJson = parsePhoneNumber(value);
        this.$emit('update:modelValue', phoneJson.toJSON());
      },
    },
  };
</script>

<style scoped lang="scss" src="./_PhoneInput.scss">
</style>
