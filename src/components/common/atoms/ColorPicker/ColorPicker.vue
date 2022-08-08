<template>
  <transition v-bind="attrs['transition-attrs']">
    <div id="ColorPicker" v-bind="attrs['div-attrs']">
      <q-color :modelValue="color"
               @update:modelValue="emitColor($event)"
               v-bind="attrs['attrs']"/>
    </div>
  </transition>
</template>

<script>
  const tinycolor = require('tinycolor2');

  export default {
    name: 'ColorPicker',
    inheritAttrs: false,
    props: {
      modelValue: {
        type: [String, Object],
        default: '#008080ff',
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
      colorObjOff: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        color: '#008080ff',
      };
    },
    watch: {
      modelValue: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            let color = newVal;
            if (typeof newVal !== 'object') {
              color = this.convertColor(newVal);
            }
            this.color = this.$lget(color, 'hexa', '#008080ff');
          }
        },
      },
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // attrs defaults
        // this.$lset(newVal, 'attrs.no-header', this.$lget(newVal, 'attrs.no-header', true));
        this.$lset(newVal, 'attrs.no-footer', this.$lget(newVal, 'attrs.no-footer', true));
        this.$lset(newVal, 'attrs.default-view', this.$lget(newVal, 'attrs.default-view', 'palette'));
        this.$lset(newVal, 'attrs.style', this.$lget(newVal, 'attrs.style', 'margin: auto; max-width: 300px'));

        // div-attrs defaults
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12'));
        return newVal;
      },
    },
    methods: {
      convertColor(color) {
        let colorVar = tinycolor(color);

        let alpha = colorVar.getAlpha();
        if (!alpha) {
          colorVar.setAlpha(1);
          alpha = colorVar.getAlpha();
        }

        let hex = colorVar.toHexString();
        let hexa = colorVar.toHex8String();

        let hsla = colorVar.toHsl();

        let hsva = colorVar.toHsv();

        let rgba = colorVar.toRgb();

        return {
          alpha: alpha,
          hue: hsla.h,
          hex: hex,
          hexa: hexa,
          hsla: hsla,
          hsva: hsva,
          rgba: rgba,
        };
      },
      emitColor(color) {
        let payload = this.colorObjOff ? color : this.convertColor(color);
        this.$emit('update:modelValue', payload);
      },
    },
  };
</script>

<style scoped lang="scss" src="./_ColorPicker.scss">
</style>
