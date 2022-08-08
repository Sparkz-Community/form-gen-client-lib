<template>
  <div id="FormGroupGenerator" v-bind="attrs['row-attrs']">
    <template v-for="(group, index) in groups">
      <div v-if="group.fieldType.toLowerCase() === 'group'" :key="index" v-bind="group['col-attrs']">
        <q-card v-bind="group['card-attrs']">
          <q-card-section>
            <FormGenerator :modelValue="getValue(modelValue, group)" @update:modelValue="setGroupName($event, group)"
                           :fields="group.schema">
              <template v-for="slot in Object.keys($slots)"
                        v-slot:[slot]="slotProps">
                <slot :name="slot" v-bind="slotProps"></slot>
              </template>
            </FormGenerator>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'FormGroupGenerator',
    inheritAttrs: false,
    components: {},
    beforeCreate() {
      this.$options.components.FormGenerator = require('../../molecules/FormGenerator/FormGenerator.vue').default;
    },
    props: {
      groups: {
        type: Array,
        required: true,
      },
      modelValue: {
        required: true,
      },
    },
    watch: {
      // modelValue(val) {
      //   console.log('modelValue', val)
      // },
      // groups: {
      //   immediate: true,
      //   handler(val) {
      //     console.log('groups', val)
      //   }
      // },
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // row-attrs defaults
        this.$lset(newVal, 'row-attrs.class', this.$lget(newVal, 'row-attrs.class', 'row q-col-gutter-sm'));
        return newVal;
      },
    },
    methods: {
      getValue(value, group) {
        // console.log('getValue value', this.$lget(value, group.path, value));
        // console.log('getValue group', group.path);
        return this.$lget(value, group.path, {});
      },
      setGroupName(value, group) {
        console.log('setGroupName value:', value);
        // console.log('setGroupName this.value:', this.value);
        // console.log('setGroupName group:', group.path);
        let group_obj = {};
        group_obj[group.path] = value;
        this.$emit('update:modelValue', Object.assign({}, this.value, group_obj));
      }
    }
  };
</script>

<style scoped lang="scss" src="./_FormGroupGenerator.scss">
</style>
