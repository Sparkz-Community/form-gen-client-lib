<template>
  <div class="block_content">
    <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
      <div v-for="(item, index) in flowData"
           :key="`${item.type}${index}`"
           :class="['block', 'clearfix', {'hide-block': hideMyBlock[index] === true}]">
        <span class="json-key">
          <input type="text"
                 v-model="item.name"
                 class="key-input"
                 v-if="typeof item.name == 'string'"
                 @blur="keyInputBlur(item, $event)"/>
          <i class="collapse-down v-json-edit-icon-arrow_drop_down"
             v-if="item.type === 'object' || item.type === 'array'"
             @click="closeBlock(index, $event)"></i>
          <i v-if="item.type ==='object'" class="i-type">{{'{' + item.childParams.length + '}'}}</i>
          <i v-if="item.type === 'array'" class="i-type">{{'[' + item.childParams.length + ']'}}</i>
        </span>
        <span class="json-val">
          <template v-if="item.type === 'object'">
            <json-view :parsedData="item.childParams" v-model="item.childParams"></json-view>
          </template>

          <template v-else-if="item.type === 'array'">
            <array-view :parsedData="item.childParams" v-model="item.childParams"></array-view>
          </template>

          <template v-else>
            <span class="val">
              <input type="text"
                     v-model="item.remark"
                     class="val-input"
                     v-if="item.type === 'string'"/>
              <input type="number"
                     v-model.number="item.remark"
                     class="val-input"
                     v-if="item.type === 'number'"
                     @update:modelValue="numberInputChange(item)"/>
              <select name="value"
                      v-model="item.remark"
                      class="val-input"
                      v-if="item.type === 'boolean'">
                <option :value="true">true</option>
                <option :value="false">false</option>
              </select>
            </span>
          </template>
        </span>

        <div class="tools">
          <select v-model="item.type" class="tools-types" @change="itemTypeChange(item)">
            <option v-for="(type, index) in formats" :value="type" :key="index">{{type}}</option>
          </select>
          <i class="dragbar v-json-edit-icon-drag"></i>
          <q-icon name="delete" @click="delItem(parsedData, item, index)"></q-icon>
        </div>
      </div>
    </draggable>

    <item-add-form v-if="toAddItem" @confirm="newItem" @cancel="cancelNewItem"></item-add-form>

    <div class="block add-key" @click="addItem" v-if="!toAddItem">
      <i class="v-json-edit-icon-add"></i>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import ItemAddForm from './ItemAddForm.vue';

  export default {
    name: 'JsonView',
    components: {
      'item-add-form': ItemAddForm,
      'array-view': () => import('./ArrayView.vue'),
      draggable
    },
    props: {parsedData: {}},
    data() {
      return {
        formats: ['string', 'array', 'object', 'number', 'boolean'],
        flowData: this.parsedData,
        toAddItem: false,
        hideMyBlock: {}
      };
    },
    created() {
      this.flowData = this.parsedData || {};
    },
    watch: {
      parsedData: {
        // eslint-disable-next-line no-unused-vars
        handler(newValue, oldValue) {
          this.flowData = this.parsedData;
        }
      }
    },
    methods: {
      delItem: function (parentDom, item, index) {
        this.flowData.splice(index, 1);
        if (this.hideMyBlock[index]) this.hideMyBlock[index] = false;
        this.$emit('update:modelValue', this.flowData);
      },
      // eslint-disable-next-line no-unused-vars
      closeBlock: function (index, e) {
        this.$set(
          this.hideMyBlock,
          index,
          this.hideMyBlock[index] ? false : true
        );
      },
      addItem: function () {
        this.toAddItem = true;
      },
      cancelNewItem: function () {
        this.toAddItem = false;
      },
      newItem: function (obj) {
        let oj = {
          name: obj.key,
          type: obj.type
        };
        if (obj.type == 'array' || obj.type == 'object') {
          oj.childParams = obj.val;
          oj.remark = null;
        } else {
          oj.childParams = null;
          oj.remark = obj.val;
        }
        if (!oj.name) {
          alert('please must input a name!');
          return;
        } else {
          this.flowData.push(oj);
          this.$emit('update:modelValue', this.flowData);
          this.cancelNewItem();
        }
      },
      keyInputBlur: function (item, e) {
        if (item.name.length <= 0) {
          alert('please must input a name!');
          item.name = 'null';
          e.target.focus();
        }
      },
      onDragEnd: function () {
        this.$emit('update:modelValue', this.flowData);
      },
      itemTypeChange: function (item) {
        if (item.type === 'array' || item.type === 'object') {
          item.childParams = [];
          item.remark = null;
        }
        if (item.type === 'boolean') {
          item.remark = true;
        }
        if (item.type === 'string') {
          item.remark = '';
        }
        if (item.type === 'number') {
          item.remark = 0;
        }
      },
      numberInputChange: function (item) {
        if (!item.remark) item.remark = 0;
      }
    }
  };
</script>
