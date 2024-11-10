<template>
  <button :class="['bee-button', 'bee-button__' + theme, 'bee-button__' + size, {
    'bee-button__animation': animation
  }]" :disabled=disabled v-on='listeners'>
    <!-- 处理动画 -->
    <span v-if=animation class="bee-button--animation" ref=animation></span>
    <!-- button 内容主体 -->
    <span class="bee-button--content">

      <!--icon-->
      <bee-icon class="bee-button--icon"
                v-bind='iconConfig'
                v-if='iconConfig'
      ></bee-icon>

      <!--button content-->
      <slot></slot>
    </span>
  </button>
</template>

<script>
import helpers from '../../utils/helpers'

export default {
  name: 'BeeButton',
  props: {
    animation: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: [String, Object],
    // 主题等价于 variant 变体
    theme: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'md'
    }
  },
  computed: {
    listeners () {
      return Object.assign({}, this.$listeners, {
        click: this.clickEvent
      })
    },

    iconConfig () {
      if (helpers.typeof(this.icon) === 'string') {
        return {
          icon: this.icon
        }
      }

      if (helpers.typeof(this.icon) === 'object') {
        return this.icon
      }

      return null
    }
  },
  methods: {
    clickEvent (event) {
      this.$listeners.click && this.$listeners.click(event)
      this.animation && this.addAnimation(event)
    },

    // concretely, is ripple effect
    addAnimation (event) {
      const { left, top, width } = this.$el.getBoundingClientRect()
      // [--------------mouse point-----]
      // |<----size----------->|
      const radius = Math.max(event.pageX - left, width - (event.pageX - left))
      // size 可以认为是正方形框内接圆的半径 R
      const animationConfig = {
        diameter: radius * 2,
        top: event.pageY - (document.body.scrollTop || document.documentElement.scrollTop) - top - radius,
        left: event.pageX - (document.body.scrollLeft || document.documentElement.scrollLeft) - left - radius
      }
      const child = this.createAnimation(animationConfig)
      this.$refs.animation.insertBefore(child, this.$refs.animation.firstChild)

      window.setTimeout(() => {
        this.$refs.animation && this.$refs.animation.removeChild(child)
      }, 499)
    },

    createAnimation (config) {
      const span = document.createElement('span')
      span.style.left = `${config.left}px`
      span.style.top = `${config.top}px`
      span.style.width = `${config.diameter}px`
      span.style.height = `${config.diameter}px`
      return span
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
