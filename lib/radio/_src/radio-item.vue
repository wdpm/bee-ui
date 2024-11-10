<template>
  <label :class="['bee-radio', {
    'bee-radio__selected': this.checked,
    'bee-radio__disabled': this.disabled
  }]" v-on='listeners'>
    <transition-group name='bee-radio-fade'>
      <bee-icon key='unselected' v-bind='icons[0]' v-show='!checked'></bee-icon>
      <bee-icon key='selected' v-bind="icons[1]" v-show='checked'></bee-icon>
    </transition-group>

    <span class="bee-radio--label">
      <slot></slot>
    </span>

    <input type="radio" :disabled='disabled' @change="changeEvent" :checked='checked'>
  </label>
</template>

<script>
export default {
  name: 'BeeRadio',
  props: {
    icons: {
      type: Array,
      default: () => [{
        fontFamily: 'beefont',
        icon: 'radio-unselected'
      }, {
        fontFamily: 'beefont',
        icon: 'radio-selected'
      }]
    },
    disabled: Boolean,
    // 这里似乎是一个误写，应该仅定义为布尔类型 (Boolean) 而非数组
    // value: [Boolean]
    value: Boolean
  },
  data () {
    return {
      checked: this.value
    }
  },
  computed: {
    listeners () {
      const _listeners = {}
      for (let eventName in this.$listeners) {
        // 过滤掉 input 和 change 事件之外的所有外部监听器，以便内部使用
        if (['input', 'change'].indexOf(eventName) === -1) {
          _listeners[eventName] = this.$listeners[eventName]
        }
      }
      return _listeners
    }
  },
  methods: {
    changeEvent (e) {
      // 处理变更事件，当用户交互改变单选按钮状态时被调用。
      // 1. 更新本地 checked 状态，
      // 2. 并触发外部监听的 input 事件传递新的状态
      this.checked = e.target.checked
      this.$listeners.input && this.$listeners.input(this.checked)
    }
  },
  watch: {
    'checked': function (value, oldValue) {
      // 监听 checked 属性的变化，如果值发生变化且与 this.value 属性不一致，则触发外部的 change 事件。
      if (value !== oldValue && value !== this.value) {
        this.$listeners.change && this.$listeners.change(this.checked)
      }
    },
    // 监听外部传入的 value 变化，同步更新组件内部的 checked 状态以保持一致
    'value': function (value) {
      if (value !== this.checked) this.checked = value
    }
  }
}
</script>

<style lang="less">
  @import './radio-item.less';
</style>
