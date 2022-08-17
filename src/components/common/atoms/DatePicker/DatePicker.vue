<template>
  <transition v-bind="attrs['transition-attrs']">
    <div id="DatePicker" v-bind="attrs['div-attrs']">
      <q-field :modelValue="modelValue"
               v-bind="attrs['q-field-attrs']"
               @clear="$emit('update:modelValue', undefined)">
        <template v-slot:control>
          <DatePicker ref="DatePicker"
                      :modelValue="modelValue"
                      @update:modelValue="$emit('update:modelValue', $event)"
                      v-bind="attrs['attrs']">
            <template v-for="slot in slots" v-slot:[slot]="slotProps">
              <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
            </template>
          </DatePicker>
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
        this.$lset(newVal, 'attrs.custom-shortcuts', this.$lget(newVal, 'attrs.custom-shortcuts', [
          {key: 'thisWeek', label: 'This week', value: 'isoWeek'},
          {key: 'lastWeek', label: 'Last week', value: '-isoWeek'},
          {key: 'last7Days', label: 'Last 7 days', value: 7},
          {key: 'last30Days', label: 'Last 30 days', value: 30},
          {key: 'thisMonth', label: 'This month', value: 'month'},
          {key: 'lastMonth', label: 'Last month', value: '-month'},
          {key: 'thisYear', label: 'This year', value: 'year'},
          {key: 'lastYear', label: 'Last year', value: '-year'},
        ]));

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
