<template>
  <section :class="['bee-cascader', {
    'bee-cascader__disabled': disabled
  }]" @click="toggleOptions">
    <section class="selected--label">
      <template v-if="label">{{label}}</template>
      <span class="placeholder" v-else>{{placeholder}}</span>
    </section>
    <bee-icon class="bee-cascader--icon" icon='arr-down'></bee-icon>
  </section>
</template>

<script>
import Vue from 'vue'
import CascaderOptions from './options.vue'
import Listener from '../../utils/listener'
import helpers from '../../utils/helpers'
import getScrollParent from '../../utils/getScrollParent'

const OptionsConstructor = Vue.extend(CascaderOptions)

export default {
  name: 'BeeCascader',
  props: {
    data: {
      type: Array,
      required: true
    },
    placeholder: String,
    labelFormat: Function,
    disabled: Boolean,
    optionKey: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
        disabled: 'disabled'
      })
    },
    joinText: {
      type: String,
      default: '>'
    },
    // every 为选择父级时，立即显示父级label
    // last 为只有当最后一个子级选择完毕，才会更新标签的显示
    type: {
      type: String,
      validator: function (value) {
        return /^(last|every)$/.test(value)
      },
      default: 'last'
    },
    value: Array,
    // rename to defaultValue
    defaultValueData: Array
  },
  data () {
    return {
      isShow: false,
      selected: this.value || []
    }
  },
  computed: {
    scrollParent () {
      return getScrollParent(this.$el)
    },
    label () {
      const { data, defaultValueData, selected, labelFormat, getItemValue, getItemLabel } = this
      let text

      // If custom processing exists and has a value, return the custom value.
      if (labelFormat) {
        text = labelFormat(this.selected)
        // 这里如果text为 "",就忽略用户定义的逻辑，使用内部的逻辑
        if (text) return text.toString()
      }

      // rename to labelArray 是一个字符串数组
      text = []
      let _data = data
      let i = 0
      let selectItem = selected[i++]

      // step 1：从 data 中寻找，从selectItem的第一个元素开始
      while (_data && selectItem) {
        const _item = _data.find(v => getItemValue(v) === selectItem)
        // 如果完全找不到元素，那就直接及早返回
        if (!_item) break

        text.push(getItemLabel(_item))

        // 接下来要从此item的子元素中寻找下一个匹配的元素
        _data = _item.children
        selectItem = selected[i++]
        // 注意i++, 后面要用到此变量和selected.length对比，来判断在data中是否存在匹配
      }

      // step 2：try in default valueData
      // i <= selected.length 意味着在 data中无法找到精确匹配的子元素。如果此时defaultValueData存在，那就触发兜底机制
      // a) 如果selected.length =2, i=3 => 说明在data中找到，不会走进下面这个分支
      // b) 举例，如果selected.length =2, i=1,2 => 说明在data中无法找到
      //    b1) i=1,说明第一个元素在上面都匹配不到
      //    b2) i=2,说明第一个元素在上面可以匹配，但是第二个元素不匹配
      //        无论如何，都是逐级 getItemValue(v) 来对比字符串值，查询匹配
      if (i <= selected.length && defaultValueData) {
        while (i <= selected.length) {
          const _item = defaultValueData.find(v => getItemValue(v) === selectItem)
          if (!_item) break

          text.push(getItemLabel(_item))
          selectItem = selected[i++]
        }
      }

      return text.join(this.joinText)
    }
  },
  methods: {
    getItemLabel (data) {
      return helpers.getValueByPath(data, this.optionKey.label)
    },
    getItemValue (data) {
      return helpers.getValueByPath(data, this.optionKey.value)
    },
    getItemDisabled (data) {
      return helpers.getValueByPath(data, this.optionKey.disabled)
    },
    /**
     * 点击label元素时，切换选单列表的显示状态。这个监听是绑定在外层div容器的，一般是点击label触发
     * @param e
     */
    toggleOptions (e) {
      if (this.disabled) return

      // this.targetInOption(e.target) 表示当前点击的元素处于下拉列表范围内，此时不要切换列表的显示/隐藏状态。
      if (this._optionsInstance && this.targetInOption(e.target)) return

      this.isShow ? this.hideOption() : this.showOption()
    },
    /**
     * 判断这个element是否为 this._optionsInstance.$el的后代（间接后代也可以）
     * @param element
     * @returns {boolean}
     */
    targetInOption (element) {
      let parent = element
      while (parent) {
        if (this._optionsInstance.$el === parent) {
          break
        }
        parent = parent.parentNode
      }
      return parent !== null
    },
    showOption () {
      this.$listeners.beforeOpen && this.$listeners.beforeOpen()

      const constructorOptions = {
        data: {
          reference: this.$el,
          scrollParent: this.scrollParent,
          options: this.data,
          optionKey: this.optionKey,
          selected: this.selected || [],
          type: this.type
        },
        methods: {
          _beforeEnter: () => {
            setTimeout(() => {
              // Add global event.
              Listener.addListener(window, 'click', this.toggleOptions)
            })
          },
          _afterLeave: () => {
            this.$listeners.closed && this.$listeners.closed()
          },
          onPick: this.onPick,
          getItemLabel: this.getItemLabel,
          getItemValue: this.getItemValue,
          getItemDisabled: this.getItemDisabled
        }
      }

      this._optionsInstance = new OptionsConstructor(constructorOptions).$mount()
      this.isShow = true
    },
    hideOption () {
      if (this._optionsInstance) {
        this._optionsInstance.open = false
      }

      this.isShow = false
      // Remove global event.
      Listener.removeListener(window, 'click', this.toggleOptions)
    },

    onPick (value, hide = true) {
      hide && this.hideOption()
      // 响应输入变化
      this.$listeners.input && this.$listeners.input(value)

      // 处理值变化
      if (!helpers.equal(value, this.selected)) {
        this.selected = value
        this.$listeners.change && this.$listeners.change(value)
      }
    }
  },
  watch: {
    value: function (value) {
      // 顺序比较，严格判断相等
      if (!helpers.equal(value, this.selected)) {
        this.selected = value || []
      }
    }
  }
}
</script>

<style lang="less">
  @import './index.less';
</style>
