<template>
  <label :class="['bee-input', 'bee-input__' + theme, {
    'bee-input__disabled': disabled,
    'left--icon': icon && icon.position === 'left',
    'right--icon': icon && icon.position === 'right',
  }]">
    <input ref='input' v-on='listeners'
      :type=type
      :maxlength=maxlength
      :disabled=disabled
      :placeholder=placeholder
      :readonly=readonly
      :value='value'
    >
    <bee-icon v-if='icon'
      :class="['adorn-icon']"
      :font-family='icon.fontFamily'
      :icon="icon.icon"
      v-on='icon.listeners'
    ></bee-icon>
  </label>
</template>

<script>
import helpers from '../../utils/helpers'

export default {
  name: 'BeeInput',
  props: {
    // should be focused on page load, or when the <dialog> that it is part of is displaye
    autofocus: Boolean,
    disabled: [Boolean, String],
    // WARN: 这个object必须说明类型字段
    icon: Object,
    // https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/maxlength
    maxlength: [Number, String],
    placeholder: String,
    readonly: Boolean,
    // 这里reg充当了验证器和格式化两个职责。是不好的设计
    reg: [Function, String, RegExp],
    theme: {
      type: String,
      default: 'default'
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    listeners () {
      return Object.assign({}, this.$listeners, {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/input_event
        // 当一个 <input>、<select> 或 <textarea> 元素的 value 被修改时，会触发 input 事件。
        input: this.customInput,
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/keyup_event
        keyup: this.customKeyup
      })
    }
  },
  created () {
    this.initValue()
  },
  mounted () {
    this.$nextTick(() => {
      if (this.autofocus) {
        this.$refs.input.focus()
      }
    })
  },
  methods: {
    // 初始化周期内，只会触发input事件，这个语义是正确的
    initValue () {
      let _value = this.value || ''
      if (this.maxlength) {
        _value = _value.toString().slice(0, this.maxlength)
      }

      this.$listeners.input && this.$listeners.input(_value)
    },

    customKeyup (e) {
      // enter 需要检测 keyCode
      if (e.keyCode === 13 && this.$listeners.enter) this.$listeners.enter(e)

      // keyup 不需要检测 keyCode
      if (this.$listeners.keyup) this.$listeners.keyup(e)
    },

    customInput (e) {
      console.log(`customInput: ${e.target.value}`)
      let _value = e.target.value

      if (this.maxlength) {
        _value = _value.slice(0, this.maxlength)
      }

      if (_value && this.reg) {
        _value = this.validator(_value)

        if (_value !== e.target.value) {
          e.target.value = _value
        }
      }

      this.$listeners.input && this.$listeners.input(_value)
    },

    // 这个函数换成 Switch或者，先解析 reg函数，再执行会更清晰
    validator (value) {
      if (helpers.typeof(this.reg, 'function')) {
        const result = this.reg(value)

        if (result === false) {
          value = this.value
        } else if (result !== true) {
          // 这个判断分支等价于 result 不为 false 或者true，说明result含义是格式化后的值
          // eslint-disable-next-line no-tabs
          // REFER: reg	value的格式化函数或正则表达式字符串
          value = result
        }
      } else if (helpers.typeof(this.reg, 'regexp')) {
        // 测试失败就取原始值
        if (this.reg.test(value) === false) {
          value = this.value
        }
      } else {
        // str => Reg，测试失败就取原始值
        const regExp = new RegExp(this.reg)
        if (regExp.test(value) === false) {
          value = this.value
        }
      }

      return value
    }
  }
}
</script>

<style lang="less">
  @import './index.less';
</style>
