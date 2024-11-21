<template>
  <section :class="[
    'bee-drawer', 'position_' + position
  ]" v-if='visible'>
    <div class="bee-drawer-mask" @click='hide'></div>

    <transition name='bee-drawer'
      @before-enter='beforeEnter'
      @before-leave='beforeLeave'
      @after-enter='afterEnter'
      @after-leave='afterLeave'
    >
      <div class="bee-drawer-body" v-show='show' :style='panelStyle'>
        <slot></slot>
      </div>
    </transition>
  </section>
</template>

<script>
import helpers from '../../utils/helpers'

export default {
  name: 'BeeDrawer',
  props: {
    position: {
      type: String,
      validator: (value) => {
        return /^(top|bottom|left|right)$/.test(value)
      },
      default: 'right'
    },
    width: String,
    height: String,
    // vue2.x 中 prop 没有不是响应式数据
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // for bee-drawer(container)
      visible: false,
      // for bee-drawer-body
      show: false
    }
  },
  computed: {
    panelStyle () {
      return helpers.clearEmpty({
        width: this.width,
        height: this.height
      })
    }
  },
  mounted () {
    this.updateSwitch()
  },
  methods: {
    updateSwitch () {
      const value = this.value
      this.visible = this.show = value
      // if (value) {
      //   // value变为true，显示
      //   this.visible = value
      //   // setTimeout(() => {
      //   //   this.show = value
      //   // })
      //   this.show = value
      // } else {
      //   this.visible = value
      //   // value变为false，此时仅body隐藏
      //   this.show = value
      // }
    },

    beforeEnter () {
      this.$listeners.beforeOpen && this.$listeners.beforeOpen()
    },

    afterEnter () {
      this.$listeners.opened && this.$listeners.opened()
    },

    beforeLeave () {
      this.$listeners.beforeClose && this.$listeners.beforeClose()
    },

    afterLeave () {
      this.visible = false
      // 这个响应的是v-model，也就是prop中value的变化
      this.$listeners.input && this.$listeners.input(false)
      this.$listeners.closed && this.$listeners.closed()
    },

    hide () {
      // 此时会导致 <transition name='bee-drawer' 过渡到消失状态，触发 afterLeave ()，然后 => this.visible = false
      this.show = false
    }
  },
  watch: {
    value: function (value) {
      this.updateSwitch()
    }
  }
}
</script>

<style lang="less">
  @import './index.less';
</style>
