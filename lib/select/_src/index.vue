<template>
  <section :class="['bee-select', {
    'bee-select__multiple': this.multiple,
    'bee-select__disabled': this.disabled
  }]" @click='toggleOptions'>
    <section class="bee-select--body">
      <!-- multiple mode -->
      <template v-if='multiple'>
        <span class="placeholder" v-if='values.length === 0'>{{placeholder}}</span>

        <span class="bee-select--item" v-for='(item, key) in values' :key='key'>
          <span>{{item[1]}}</span>
          <bee-icon class='bee-remove--button' icon='error' @click.stop='removeSelectedItem(key)'></bee-icon>
        </span>
      </template>

      <!-- single mode -->
      <template v-else>
<!--        当前已选列表不存在，并且搜索关键词不存在 => 显示默认提示的占位符-->
        <span class="placeholder" v-if='values.length === 0 && !keyword'>{{placeholder}}</span>

<!--        显示已选项的标签-->
        <span v-if='searchDisabled' class="bee-selected--label">{{selectedLabel}}</span>

        <!-- open search -->
        <input v-else
          class="bee-search--input"
          type="text"
          ref='search'
          :disabled="disabled"
          :readonly='readonly'
          v-model.trim='keyword'
        >
      </template>
    </section>
<!--    下拉icon-->
    <bee-icon class="bee-select--icon" icon='arr-down'></bee-icon>
  </section>
</template>

<script>
import Vue from 'vue'
import SelectOptions from './select-options.vue'
import Listener from '../../utils/listener'
import getScrollParent from '../../utils/getScrollParent'
import helpers from '../../utils/helpers'

const OptionsConstructor = Vue.extend(SelectOptions)

export default {
  name: 'BeeSelect',
  props: {
    // 初始option元素
    value: null,
    // 初始值不为空，并且在options中无法找到时，会在此项中寻找相应的值
    // 这个字段设计是干嘛的
    defaultValueOptions: Array,
    // 可选项数组
    options: {
      type: Array,
      required: true
    },
    optionKey: {
      type: Object,
      // option element's key name to get value
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    type: {
      type: String,
      default: 'auto'
    },
    placeholder: String,
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // searchModeThreshold
    searchLength: {
      type: Number,
      default: 10
    }
  },

  data () {
    return {
      // 可读状态
      readonly: true,

      // 表示当前已被选择的值，因为要支持多选，因此这里是一个数组。rename to selectedValues or selectedOptions
      values: [],

      // 用于搜索option项的关键字 rename to searchKeyword
      keyword: '',

      // 为false表示处于未显示选项列表状态，为true表示处于显示选项列表的状态。 rename to isInShowOptionsState
      toggle: false
    }
  },
  computed: {
    // 为什么需要知道可滑动的父容器元素
    scrollParent () {
      return getScrollParent(this.$el)
    },

    searchDisabled () {
      if (this.multiple) return true

      if (this.type === 'search') return false

      return this.type === 'auto' && this.options.length < this.searchLength
    },

    selectedLabel () {
      return helpers.getValueByPath(this.values, '[0][1]')
    }
  },
  mounted () {
    if (this.value !== undefined && this.value !== null) {
      this.valuesInit()
    }
  },
  methods: {
    targetInOptions (e) {
      let target = e ? e.target : null

      while (target) {
        if (target !== this._optionsInstance.$el) {
          target = target.parentNode
          continue
        }
        break
      }

      return target
    },

    /**
     * Toggles the visibility of options based on the current state and event.
     * @param {Event} e - The event triggering the option toggle.
     * @returns {void}
     */
    toggleOptions (e) {
      if (this.disabled) return

      if (this.toggle && !this.targetInOptions(e)) {
        this.hideOptions(e)
        return
      }

      if (!this.toggle) {
        this.showOptions(e)
      }
    },

    showOptions () {
      this.toggle = true

      const _data = () => {
        return {
          selected: helpers.deepCopy(this.values),
          options: this.options,
          optionKey: this.optionKey,
          multiple: this.multiple,
          // 使用父容器的宽度来限制option list的宽度
          minWidth: this.$el.offsetWidth,
          scrollParent: this.scrollParent,
          reference: this.$el,
          onSelected: this.onSelected
        }
      }

      const _beforeEnter = () => {
        // if the search function be enabled, the input value is auto selected.
        if (!this.searchDisabled) {
          // highlight the matched text in option list
          this.readonly = false
          this.$refs.search.focus()
          this.$refs.search.select()
        }

        setTimeout(() => {
          // 这里绑定到了window，设计不好，应该仅绑定到特定影响的元素
          Listener.addListener(window, 'click', this.toggleOptions)
        })
      }

      // 这里单独赋值到一个实例变量，方便TDD
      this._optionsInstance = new OptionsConstructor({
        data: _data,
        methods: {
          beforeEnter: _beforeEnter
        }
      }).$mount()
    },

    hideOptions () {
      if (!this.searchDisabled) {
        // if the search function be enabled, the input will be readonly.
        this.readonly = true

        // if the search function be used and nothing selected, to restore the label.
        if (this.value && !this.values.find(item => item && item[1] === this.keyword)) {
          this.keyword = helpers.getValueByPath(this.values, '[0][1]', '')
        }
      }

      this.toggle = false
      this._optionsInstance.open = false
      Listener.removeListener(window, 'click', this.toggleOptions)
    },

    onSelected (data) {
      // 单选模式下，option list实例存在并打开，并且点击了其中一项时，应该关闭option list的显示
      if (!this.multiple && this._optionsInstance && this._optionsInstance.open) {
        this.hideOptions()
      }

      // If the value to equal old value or undefined, break after.?
      // When the length of the this.options is 0, the data will be undefined.
      if (!data || helpers.equal(data, this.values)) return

      this.updateSelected(helpers.deepCopy(data), true)
    },

    updateSelected (data, emit) {
      this.values = data
      let _value = null

      if (this.multiple) {
        // resolve the options position error by reference resize.
        if (this._optionsInstance && this._optionsInstance.open) {
          this.$nextTick(() => {
            this._optionsInstance.$refs.popper.updatePosition()
          })
        }

        // 这里只取 label 字段组成数组
        _value = data.map(item => item[0])
      } else {
        _value = helpers.getValueByPath(data, '[0][0]')

        if (!this.searchDisabled) {
          this.keyword = helpers.getValueByPath(data, '[0][1]')
        }
      }

      if (!emit) return

      // Emit events.
      const events = ['input', 'change']
      events.forEach((eventName) => {
        if (this.$listeners[eventName]) {
          this.$listeners[eventName](_value)
        }
      })
    },

    valuesInit () {
      const { value, optionKey, options, defaultValueOptions } = this
      const dataArray = helpers.typeof(value) !== 'array' ? [value] : value

      // 此函数用于遍历选项数组，提取每个选项的值（通过optionKey.value路径）和标签（通过optionKey.label路径），
      // 并检查这些值是否存在于dataArray中。如果存在，则将值-标签对添加到累加器（acc）数组中。
      function reduceIterator (acc, item) {
        const _value = helpers.getValueByPath(item, optionKey.value)
        const _label = helpers.getValueByPath(item, optionKey.label)

        if (dataArray.indexOf(_value) > -1) {
          // 其实这里selected 还是推荐重构为元素也是对象的形式，即{label:'',value: 1}
          // [value,label]
          acc.push([_value, _label])
        }

        return acc
      }

      // 遍历options，应用reduceIterator函数，初始累加器为空数组。
      let values = options.reduce(reduceIterator, [])
      // 如果有 defaultValueOptions 选项，也用同样的方式处理并合并到已有的values中。
      if (defaultValueOptions) {
        values = defaultValueOptions.reduce(reduceIterator, values)
      }

      // 如果values数组为空且原始value存在，则发出事件 => 说明用户设置的初始option根本不在可选列表中，即非法
      // 为什么需要emit?
      this.updateSelected(values, values.length === 0 && value)
    },

    removeSelectedItem (index) {
      // copyOnWrite strategy
      let _values = helpers.deepCopy(this.values)
      _values.splice(index, 1)
      this.onSelected(_values)

      // 这里就可以看到 this._optionsInstance.selected = this.values 这个是 invariant 约束
      if (this._optionsInstance && this._optionsInstance.open) {
        this._optionsInstance.selected = _values
      }
    }
  },
  watch: {
    'options': function (value, oldValue) {
      if (value.length === 0 && oldValue.length === 0) return

      this.valuesInit()

      if (this._optionsInstance) {
        this._optionsInstance.options = value
        this._optionsInstance.selected = this.values
      }
    },

    'value': function (newValue, oldValue) {
      // 复杂对象需要自定义的脏值检测
      if (helpers.equal(newValue, oldValue) === false) {
        this.valuesInit()
      }
    },

    'keyword': function (value) {
      // 只读模式禁用搜索
      if (this.readonly) return

      // abc => a.*b.*c 这样是为了兼容字母之间的字符（包含空格） a  b  c
      const reg = value.length ? new RegExp(value.split('').join('.*')) : /.*/

      // 过滤后的选项数组被赋值给this._optionsInstance.options，这会更新显示给用户的可选项，
      // 使得只有匹配关键词的项目可见。
      this._optionsInstance.options = this.options.filter(item => {
        const _label = helpers.getValueByPath(item, this.optionKey.label)
        return reg.test(_label)
      })
    }
  }
}
</script>

<style lang='less'>
@import './index.less';
</style>
