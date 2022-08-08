<template>
  <transition v-bind="attrs['transition-attrs']">
    <div id="NumberInput" v-bind="attrs['div-attrs']">
      <span v-if="label"><b>{{ label }}:</b></span>
      <vue-number-input :name="path" :modelValue="modelValue" @change="$emit('update:modelValue', $event)" v-bind="attrs['attrs']">
        <template v-for="slot in slots" v-slot:[slot]="slotProps">
          <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
        </template>
      </vue-number-input>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'NumberInput',
    inheritAttrs: false,
    props: {
      modelValue: {
        type: [String, Number],
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
      label: {
        type: String,
      },
    },
    data() {
      return {};
    },
    watch: {
      '$q.dark.mode': {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            if (newVal) {
              this.$lset(this.attrs, 'attrs.attrs.style', this.$lget(this.attrs, 'attrs.attrs.style', '') + ' background-color: var(--q-color-dark); color: white;');
            } else {
              this.$lset(this.attrs, 'attrs.attrs.style', this.$lget(this.attrs, 'attrs.attrs.style', '') + ' background-color: white; color: black;');
            }
          }
        },
      },
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // attrs defaults
        this.$lset(newVal, 'attrs.controls', this.$lget(newVal, 'attrs.controls', true));

        // div-attrs defaults
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        this.$lset(newVal, 'div-attrs.style', {...this.$lget(newVal, 'div-attrs.style', {}), ...this.inputButtonStyles});
        return newVal;
      },
      inputButtonStyles() {
        return {
          '--number-input-button-background': this.$q.dark.mode ? 'var(--q-color-dark)' : 'white',
          '--number-input-button-color': this.$q.dark.mode ? 'white' : 'black',
        };
      },
    },
  };
</script>

<style scoped lang="scss" src="./_NumberInput.scss">
</style>
