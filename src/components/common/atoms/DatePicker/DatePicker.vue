<template>
  <transition v-bind="attrs['transition-attrs']">
    <div id="DatePicker" v-bind="attrs['div-attrs']">
      <q-field :modelValue="modelValue"
               v-bind="attrs['q-field-attrs']"
               @clear="$emit('update:modelValue', undefined)">
        <template v-slot:control>
          <VueDatePicker ref="DatePicker"
                      :modelValue="modelValue"
                      @update:modelValue="$emit('update:modelValue', $event)"
                      v-bind="attrs['attrs']">
            <template v-for="slot in slots" v-slot:[slot]="slotProps">
              <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
            </template>
          </VueDatePicker>
        </template>
      </q-field>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'DatePicker',
    inheritAttrs: false,
    props: {
      modelValue: {
        type: String,
      },
      path: {
        required: true,
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
        // attrs defaults
        this.$lset(newVal, 'attrs.weekStart', this.$lget(newVal, 'attrs.weekStart', 0));
        this.$lset(newVal, 'attrs.is24', this.$lget(newVal, 'attrs.is24', false));
        this.$lset(newVal, 'attrs.position', this.$lget(newVal, 'attrs.position', 'left'));
        this.$lset(newVal, 'attrs.showNowButton', this.$lget(newVal, 'attrs.showNowButton', true));
        this.$lset(newVal, 'attrs.autoApply', this.$lget(newVal, 'attrs.autoApply', true));
        this.$lset(newVal, 'attrs.closeOnAutoApply', this.$lget(newVal, 'attrs.closeOnAutoApply', false));
        if (this.$lget(newVal, 'attrs.timePicker')) {
          this.$lset(newVal, 'attrs.modeHeight', this.$lget(newVal, 'attrs.modeHeight', 120));
        }

        // div-attrs defaults
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));

        // q-field-attrs defaults
        // this.$lset(newVal, 'q-field-attrs.label', this.$lget(newVal, 'q-field-attrs.label', 'Select Icon:'));
        this.$lset(newVal, 'q-field-attrs.filled', this.$lget(newVal, 'q-field-attrs.filled', true));
        // this.$lset(newVal, 'q-field-attrs.clearable', this.$lget(newVal, 'q-field-attrs.clearable', true));
        if (this.$lget(newVal, 'q-field-attrs.rules')) {
          this.$lset(newVal, 'q-field-attrs.rules', this.$lget(newVal, 'q-field-attrs.rules', []));
        }
        return newVal;
      },
    },
  };
</script>
