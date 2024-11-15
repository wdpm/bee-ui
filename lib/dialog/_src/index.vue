<template>
  <transition name='bee-dialog' @before-enter='beforeEnter' @after-leave='afterLeave'>
    <div class='bee-dialog' v-if='value'>
      <!--   v-loading 的指令实现，参考 lib/loading/index.js -->
      <div class='bee-dialog--panel' :style='{
        "width": this.width
      }'
           v-loading='loading'
           :data-loading-type='loadingType'
           :data-loading-text='loadingText'
      >
        <div class='bee-dialog--title'>
          <span class='bee-dialog-title--text'>{{ title }}</span>

          <bee-icon v-if='closeVisible'
                    class='bee-dialog--close'
                    icon='close'
                    @click='close'
          ></bee-icon>
        </div>

        <div class='bee-dialog--body'>
          <slot></slot>
        </div>

        <div class='bee-dialog--footer' v-if='cancelVisible || confirmVisible'>
          <bee-button v-if='cancelVisible'
                      class='bee-dialog--btn__cancel'
                      @click='cancel'
          >{{ cancelText }}
          </bee-button>

          <bee-button v-if='confirmVisible'
                      class="bee-dialog--btn__confirm"
                      theme='primary'
                      @click='confirm'
          >{{ confirmText }}
          </bee-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BeeDialog',
  props: {
    // 是否处于显示的状态
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '500px'
    },
    title: {
      type: String,
      default: function () {
        return this.$_language('TAP')
      }
    },
    // 关闭按钮是否可见
    closeVisible: {
      type: Boolean,
      default: true
    },
    // 取消按钮是否可见
    cancelVisible: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: function () {
        return this.$_language('CANCEL')
      }
    },
    // 确认按钮是否可见
    confirmVisible: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: function () {
        return this.$_language('CONFIRM')
      }
    },
    // 是否添加 loading 效果, rename to hasLoadingIndicator
    loading: {
      type: Boolean,
      default: false
    },
    // rename to loadingIndicatorType
    loadingType: String,
    // rename to loadingIndicatorText
    loadingText: String,
    // confirm 事件是否是同步事件
    sync: {
      type: Boolean,
      default: true
    },
    // 是否阻止鼠标穿透
    stopPenetrate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollBehavior: {
        style: null,
        top: null,
        left: null
      }
    }
  },
  methods: {
    beforeEnter (el) {
      // 如果存在 beforeEnter hook 就先处理
      this.$listeners.beforeEnter && this.$listeners.beforeEnter(el)

      if (this.stopPenetrate) {
        this.scrollBehavior.top = document.body.scrollTop || document.documentElement.scrollTop
        this.scrollBehavior.left = document.body.scrollLeft || document.documentElement.scrollLeft
        // getAttribute('style') 返回的是一个 字符串，字符串在 JavaScript 中是原始数据类型（primitive value），
        // 它是按值传递的。换句话说，this.scrollBehavior.style 存储的是 style 属性的一个副本，而不是对 document.body 的引用。
        // 因此，this.scrollBehavior.style 的值和 document.body 上的 style 属性是 独立的，
        // 如果之后修改 this.scrollBehavior.style 不会影响 document.body 的 style 属性，反之亦然。

        // 总之，这里 this.scrollBehavior.style 保存的是 body 之前的 style，后续要用于还原的。
        this.scrollBehavior.style = document.body.getAttribute('style')

        // 写时复制
        let style = this.scrollBehavior.style

        // 这里非常精准地只对两个属性进行设置，并且写回 body
        // [height: 100vh] and [overflow: hidden] => make background body fixed.

        if (/height:\s*\w+;/.test(style)) {
          style.replace(/height:\s*\w+;/, 'height: 100vh;')
        } else {
          style += 'height: 100vh;'
        }

        if (/overflow:\s*\w+;/.test(style)) {
          style.replace(/overflow:\s*\w+;/, 'overflow: hidden;')
        } else {
          style += 'overflow: hidden;'
        }

        // 写回 body，注意此时 style 和 this.scrollBehavior.style 已经是不一样的样式了。
        document.body.setAttribute('style', style)
      }
    },

    afterLeave (el) {
      this.$listeners.afterLeave && this.$listeners.afterLeave(el)

      // 在 dialog 关闭显示后，应该将之前保存的 body style 恢复到之前的状态。
      if (this.stopPenetrate) {
        // recover style of document.body
        // a) 如果有存储的样式，就恢复 body 的样式；=> 这个很好理解
        // b) 如果没有存储样式，则移除 body 的样式。=> 这个是指什么情形？this.scrollBehavior.style 为空，代表原来 body.style 就是空，
        // 此时 document.body.removeAttribute('style') 是为了保险吗
        this.scrollBehavior.style ? document.body.setAttribute('style', this.scrollBehavior.style)
          : document.body.removeAttribute('style')
        this.scrollBehavior.style = null

        // recover top and left of document.body
        document.body.scrollTop = this.scrollBehavior.top
        document.documentElement.scrollTop = this.scrollBehavior.top
        this.scrollBehavior.top = null

        document.body.scrollLeft = this.scrollBehavior.left
        document.documentElement.scrollLeft = this.scrollBehavior.left
        this.scrollBehavior.left = null
      }
    },

    hide () {
      // If the update:value event was being bound.
      this.$listeners.input && this.$listeners.input(false)
    },

    close () {
      // If the close event was being bound.
      this.$listeners.close && this.$listeners.close(false)

      this.hide()
    },

    cancel () {
      // If the cancel event was being bound.
      this.$listeners.cancel && this.$listeners.cancel()

      this.close()
    },

    confirm () {
      if (this.sync) this.hide()

      // If the confirm event was being bound.
      this.$listeners.confirm && this.$listeners.confirm(this.hide)
    }
  }
}
</script>

<style lang='less'>
@import './index.less';
</style>
