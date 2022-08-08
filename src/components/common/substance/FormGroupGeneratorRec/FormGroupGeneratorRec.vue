<template>
  <div id="FormGroupGeneratorRec" v-bind="attrs['row-attrs']">
    <template v-for="(group, index) in groups" :key="index">
      <div v-if="group.fieldType.toLowerCase() === 'group'" v-bind="group['col-attrs']">
        <q-card v-bind="group['card-attrs']">
          <q-card-section>
            <FormGroupGenerator :modelValue="getValue(modelValue, group)" @update:modelValue="setGroupName($event, group)"
                                :groups="group.schema">
              <template v-for="slot in Object.keys($slots)"
                        v-slot:[slot]="slotProps">
                <slot :name="slot" v-bind="slotProps"></slot>
              </template>
            </FormGroupGenerator>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12" v-else :key="index">
        <FormGenerator :modelValue="modelValue" @update:modelValue="setGroupName($event, group)" :fields="[group]"
                       v-on="listeners">
          <template v-for="slot in Object.keys($slots)"
                    v-slot:[slot]="slotProps">
            <slot :name="slot" v-bind="slotProps"></slot>
          </template>
        </FormGenerator>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'FormGroupGeneratorRec',
    inheritAttrs: false,
    components: {},
    beforeCreate() {
      this.$options.components.FormGroupGenerator = require('./FormGroupGeneratorRec.vue').default;
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
        if (group.fieldType.toLowerCase() === 'group') {
          console.log('setGroupName value:', value);
          // console.log('setGroupName this.modelValue:', this.modelValue);
          // console.log('setGroupName group:', group.name);
          let group_obj = {};
          group_obj[group.path] = value;
          this.$emit('update:modelValue', Object.assign({}, this.modelValue, group_obj));
        } else {
          // console.log('else setGroupName value:', value);
          // console.log('else setGroupName group:', group.path);
          this.$emit('update:modelValue', Object.assign({}, value));
        }
      }
    }
  };
</script>

<style scoped lang="scss" src="./_FormGroupGeneratorRec.scss">
</style>
