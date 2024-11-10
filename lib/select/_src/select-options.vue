<template>
<!--  使用popper作为弹出层-->
  <bee-popper class="select-options"
    :scroll-parent="scrollParent"
    :reference="reference"
    v-model='open'
    @beforeEnter='beforeEnter'
    @afterLeave='afterLeave'
    ref='popper'
    >
<!--    使用自定义的滑动条组件-->
    <bee-scrollbar class="options--body"
      :style='{minWidth: `${minWidth}px`}'
      show-type='hover'
      ref='scrollbar'
    >
      <!-- option list -->
      <div v-for='(option, key) in options' :key='key' :class="['option--item', {
        'option--item__selected': itemIsSelected(option)
      }]" @click='selectItem(option)'>
        <span>{{optionLabel(option)}}</span>

        <bee-icon class="item-icon" icon='correct' v-if='itemIsSelected(option)'></bee-icon>
      </div>

      <!-- nothing can be selected -->
      <!--  $_language()意义不明    -->
      <div v-if='options.length === 0' class="options__empty" @click='selectItem()'>{{$_language('SELECT_EMPTY')}}</div>
    </bee-scrollbar>
  </bee-popper>
</template>

<script>
import helpers from '../../utils/helpers'

export default {
  name: 'BeeSelectOptions',
  data () {
    return {
      // 已选的列表
      selected: [],
      // 是否处于显示状态
      open: false,
      // 能选的列表
      options: null,
      // 从可选列表中取字段的mapping
      optionKey: null,
      // 多选模式
      multiple: null,
      // 父容器
      scrollParent: null,
      // 当前组件容器的引用
      reference: null,
      minWidth: null,
      onSelected: null
    }
  },
  computed: {
    optionLabel () {
      // path = 'label'

      // data
      // {
      //   label: 'a',                => a
      //     value: 1
      // }
      return (data) => helpers.getValueByPath(data, this.optionKey.label)
    },
    optionValue () {
      return (data) => helpers.getValueByPath(data, this.optionKey.value)
    }
  },
  mounted () {
    // 这个弹出层是绝对定位，挂载到body
    document.body.appendChild(this.$el)
    this.open = true

    this.$nextTick(() => {
      // 使用自定义的scrollbar 来更新配置
      this.$refs.scrollbar.updateSizeConfig()
    })
  },
  destroyed () {
    // 从body中删除这个组件实例
    if (this._vnode.elm.parentNode) {
      this._vnode.elm.parentNode.removeChild(this._vnode.elm)
    }
  },
  methods: {
    beforeEnter () {},

    afterLeave () {
      this.$destroy()
    },

    selectItem (option) {
      // 如果当前option为空，那就是直接调用父容器的选择回调，然后返回
      if (!option) {
        this.onSelected()
        return
      }

      const _value = this.optionValue(option)
      const _label = this.optionLabel(option)

      if (this.multiple) {
        const _index = this.selected.findIndex(item => item[0] === _value)

        // 多选模式下，如果在已选数组中找到了当前的选择项，说明这个操作是删除
        if (_index > -1) {
          this.selected.splice(_index, 1)
        } else {
          // 否则，是添加
          this.selected.push([_value, _label])
        }
      } else {
        // 单选模式下，数组只有一个元素，这个元素也是一个数组。
        this.selected = [[_value, _label]]
      }

      // 调用父组件的事件回调
      this.onSelected(this.selected)
    },

    itemIsSelected (option) {
      return this.selected.findIndex(item => item[0] === this.optionValue(option)) > -1
    }
  },
  watch: {
    // 可选项一旦变动，就需要重新计算size
    'options': function () {
      this.$refs.scrollbar.updateSizeConfig()
    }
  }
}
</script>

<style lang="less">
  @import './select-options.less';
</style>
