<template>
  <div id="LoginForm" v-bind="attrs['div-attrs']">
    <FormGenerator :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :fields="fields">
      <template v-slot:prepend="{key_name}">
        <q-icon v-if="key_name === 'email'" name="mail"/>
        <q-icon v-if="key_name === 'password'" name="lock"/>
      </template>
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" @click="isPwd = !isPwd"/>
      </template>

      <template v-for="slot in Object.keys($slots)"
                v-slot:[slot]="slotProps">
        <slot :name="slot" v-bind="slotProps"></slot>
      </template>
    </FormGenerator>
  </div>
</template>

<script>
  import FormGenerator from '../../common/molecules/FormGenerator/FormGenerator';

  export default {
    name: 'LoginForm',
    inheritAttrs: false,
    components: {
      FormGenerator
    },
    props: {
      modelValue: {
        required: true,
      },
    },
    data() {
      return {
        isPwd: true,
        fields: [
          {
            fieldType: 'TextInput',
            path: 'email',
            slots: ['prepend'],
            attrs: {
              label: 'Email',
              type: 'email',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              rules: [
                val => {
                  return val && val.length > 0 || 'Email can\'t be empty';
                },
                val => {
                  let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
                  return reg.test(val) || 'Must be valid email';
                }
              ],
            },
            'div-attrs': {
              class: 'col-12'
            },
          },
          {
            fieldType: 'TextInput',
            path: 'password',
            slots: ['prepend', 'append'],
            attrs: {
              label: 'Password',
              type: 'password',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              rules: [
                val => {
                  return val && val.length > 0 || 'Password can\'t be empty';
                }
              ],
            },
            'div-attrs': {
              class: 'col-12'
            }
          },
        ]
      };
    },
    watch: {
      password: {
        deep: true,
        immediate: true,
        handler(newVal) {
          let password = this.$lfind(this.fields, {path: 'password'});
          password.attrs.type = newVal;
        }
      }
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        this.setChildSchemaOverride(newVal);
        this.mergeChildSchema(newVal);

        // attrs
        // this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));

        // div-attrs
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12'));
        return newVal;
      },
      password() {
        return this.isPwd ? 'password' : 'text';
      }
    },
    methods: {
      setChildSchemaOverride(attrs) {
        Object.keys(this.$lget(attrs, 'childSchemaOverride', {})).forEach(item => {
          let field = this.$lfind(this.fields, {path: item});
          if (!this.$lisEmpty(field)) {
            this.$lmerge(field, attrs.childSchemaOverride[item]);
          }
        });
      },
      mergeChildSchema(attrs) {
        this.fields = this.$lunionWith(this.fields, this.$lget(attrs, 'mergedFields', []), this.$lisEqual);
      }
    }
  };
</script>

<style scoped lang="scss" src="./_LoginForm.scss">
</style>
