<template>
  <section :class="['bee-alias', {
    // rename to __focus
    'bee-alias_focus': toggle
  }]">
    <div class="alias-name" @click='optionToggle'>
      <span v-if='value'>{{value}}</span>
      <span class="placeholder" v-else>{{placeholder}}</span>
    </div>

    <bee-icon class="remove-button"
      v-show='value'
      icon='error'
      @click.stop="removeSelected"
    ></bee-icon>
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
  name: 'bee-alias',
  props: {
    options: Array,
    optionKey: {
      type: String,
      default: ''
    },
    placeholder: String,
    maxWidth: {
      type: String,
      default: '300px'
    },
    minHeight: {
      type: String,
      default: '60px'
    },
    // 这个value应该是空，或者为options中的一个元素
    value: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      toggle: false
    }
  },
  computed: {
    scrollParent () {
      return getScrollParent(this.$el)
    }
  },
  methods: {
    optionToggle (e) {
      // 如果下拉选单处于显示状态，但是点击了其他区域 => 隐藏选单
      if (this.toggle && !helpers.isNodeChild(e.target, this._optionsInstance.$el)) {
        this.hide()
        return
      }

      // 如果之前选单为隐藏状态，那就显示选单
      if (!this.toggle) {
        this.show()
      }
    },
    show () {
      this.toggle = true
      const _data = () => {
        return {
          selected: this.value,
          options: this.options,
          optionKey: this.optionKey,
          maxWidth: this.maxWidth,
          minWidth: this.$el.offsetWidth + 'px',
          minHeight: this.minHeight,
          scrollParent: this.scrollParent,
          reference: this.$el,
          onSelected: this.onSelected
        }
      }

      const _beforeEnter = () => {
        setTimeout(() => {
          // 这里对window进行全局监听是合理的
          Listener.addListener(window, 'click', this.optionToggle)
        })
      }

      this._optionsInstance = new OptionsConstructor({
        data: _data,
        methods: {
          beforeEnter: _beforeEnter,
          getValue: this.getValue
        }
      }).$mount()
    },

    hide () {
      this.toggle = false
      this._optionsInstance.open = false
      Listener.removeListener(window, 'click', this.optionToggle)
    },

    getValue (data) {
      if (this.optionKey) {
        return helpers.getValueByPath(data, this.optionKey)
      }

      return data
    },

    onSelected (data) {
      const _value = helpers.deepCopy(this.getValue(data))

      if (helpers.equal(_value, this.value)) return

      this.hide()
      this.$listeners.input && this.$listeners.input(_value)
      this.$listeners.change && this.$listeners.change(_value)
    },

    removeSelected () {
      if (!this.value) return

      // emit
      this.$listeners.input && this.$listeners.input('')
      this.$listeners.change && this.$listeners.change('')

      // 如果此时选单列表为隐藏状态，那就直接返回。这里的 !this._optionsInstance 代码防御检测风格很好
      if (!this.toggle || !this._optionsInstance) return

      // 如果目前选单是显示状态，那么需要维持选单显示，并重置选单到未选择任何item的状态
      this._optionsInstance.selected = ''
    }
  }
}
</script>

<style lang="less">
  @import './index.less';
</style>
