<template>
  <transition v-bind="attrs['transition-attrs']">
    <div id="toggle-me" v-bind="attrs['div-attrs']">
      <iy-toggle-me :name="path"
                    :modelValue="modelValue"
                    @update:modelValue="$emit('update:modelValue', $event)"
                    v-bind="attrs['attrs']">
        <template v-for="slot in slots" v-slot:[slot]="slotProps">
          <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
        </template>
      </iy-toggle-me>
    </div>
  </transition>
</template>

<script>

  export default {
    name: 'ToggleMe',
    inheritAttrs: false,
    components: {
      iyToggleMe: () => import('@sparkz-community/common-client-lib').then(module => module.ToggleMe),
    },
    props: {
      modelValue: {
        required: true,
        default: null,
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
      return {
      };
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // attrs defaults
        this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));
        if (this.$lget(newVal, 'attrs.rules')) {
          this.$lset(newVal, 'attrs.rules', this.$lget(newVal, 'attrs.rules', []));
        }

        // div-attrs defaults
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));

        // attrs validation
        let rules = this.$lget(newVal, 'attrs.rules', []);
        let new_rule = val => val !== '' || `${this.$lget(newVal, 'attrs.label')} is required`;
        if (this.$lget(newVal, 'attrs.required') && !rules.map(item => item.toString()).includes(new_rule.toString())) {
          rules.push(new_rule);
          this.$lset(newVal, 'attrs.rules', rules);
        }
        // console.log('rules', rules);
        return newVal;
      },
    },
  };
</script>

<style scoped lang="scss" src="./_ToggleMe.scss">

</style>
