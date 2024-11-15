<template>
  <div class='bee-step'>
    <div class="bee-step--body">
      <div :class="['bee-step--item', {
        'bee-step--item__active': Number(step) >= index + 1
      }]" v-for="(item, index) in config" :key='index'
           :style="itemStyle">
        <!--  horizontal divider line， 左右两边都有1/2容器宽度      -->
        <section class="bee-step--line"></section>

        <!--   step N     -->
        <section class="bee-step-item--main">
          <!--  Number(step) > index + 1 表示已完成的 step， 使用icon而不是文本    -->
          <bee-icon icon='correct' v-if="Number(step) > index + 1"></bee-icon>
          <template v-else>{{ index + 1 }}</template>
        </section>

        <!--   item label     -->
        <p class="bee-step-item--label">
          <template v-if='isString(item)'>{{ item }}</template>
          <template v-else>{{ item.label }}</template>
        </p>

        <!--   item desc     -->
        <p class="bee-step-item--desc" v-if='item && item.desc'>{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '../../utils/helpers'

export default {
  name: 'BeeStep',
  props: {
    config: {
      type: Array,
      required: true
    },
    step: {
      type: [Number, String],
      default: 1
    }
  },
  computed: {
    itemStyle () {
      return {
        // 等分每一个 step 的宽度
        width: `${100 / this.config.length}%`
      }
    },
    isString () {
      return data => helpers.typeof(data, 'string')
    }
  }
}
</script>

<style lang='less'>
@import './index.less';
</style>
