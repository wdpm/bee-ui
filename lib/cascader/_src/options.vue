<template>
  <bee-popper class="bee-cascader-options"
              :reference='reference'
              :scroll-parent="scrollParent"
              @beforeEnter='beforeEnter'
              @afterLeave='afterLeave'
              v-model='open'
              ref='popper'
  >
    <div class="bee-cascader-item-options" v-if="optionsData.length === 0">
      <div class="options--empty"> 暂无可选项</div>
    </div>
    <template v-else>
      <!-- 第一层是循坏父级元素 -->
      <section class="bee-cascader-item-options" v-for="(item, key) in optionsData" :key="key">
        <bee-scrollbar>
          <!-- 循环子级元素列表 -->
          <template v-for="(option, optionKey) in item" >
            <div :class="['options--item', {
              'options--item__active': itemIsActive(option),
              'options--item__disabled': getItemDisabled(option)
            }]"
                 :key="optionKey"
                 @click="optionItemSelected(option, key)"
            >
              <span>{{ getItemLabel(option) }}</span>
              <bee-icon icon="right" v-if="option.children && option.children.length > 0"></bee-icon>
            </div>
          </template>
        </bee-scrollbar>
      </section>
    </template>
  </bee-popper>
</template>

<script>
export default {
  data () {
    return {
      open: false,
      reference: null,
      selected: [],
      options: [],
      optionKey: null,
      optionsData: []
    }
  },
  created () {
    this.updateOptions(this.selected)
  },
  mounted () {
    document.body.appendChild(this.$el)
    this.open = true

    this.$nextTick(() => {
      this.updateScrollTop()
    })
  },
  destroyed () {
    if (this._vnode.elm.parentNode) {
      this._vnode.elm.parentNode.removeChild(this._vnode.elm)
    }
  },
  methods: {
    beforeEnter () {
      this._beforeEnter()
    },
    afterLeave () {
      this._afterLeave()
      this.$destroy()
    },
    itemIsActive (data) {
      return this.selected.indexOf(this.getItemValue(data)) > -1
    },
    updateOptions (selected = []) {
      if (!this.options.length) return

      const _options = [this.options]
      let i = 0
      let data = this.options
      let selectItem = selected[i++]

      while (data && selectItem) {
        const _item = data.find(v => this.getItemValue(v) === selectItem)

        if (!_item || !_item.children) break

        data = _item.children
        // 这里是将当前父级元素的子元素（数组形式）放入 _options
        _options.push(data)
        selectItem = selected[i++]
      }

      this.optionsData = _options
      console.log(this.optionsData)
    },
    updateScrollTop () {
      const selects = this.$el.querySelectorAll('.options--item__active')
      let i = 0

      // 调整父元素的 scrollTop 属性，使其滚动到当前活跃项目的位置。
      // 通过将父元素的滚动位置设置为活跃项目的 offsetTop 减去父元素的 offsetTop 来实现的。
      while (i < selects.length) {
        const _item = selects[i++]
        const _itemParent = _item.parentNode
        // _item.offsetTop - _itemParent.offsetTop 即是当前已激活元素的滑动距离
        _itemParent.scrollTop = _item.offsetTop - _itemParent.offsetTop
      }
    },
    optionItemSelected (data, index) {
      if (this.getItemDisabled(data)) return

      // 创建一个新数组_selected,包含当前选中项之前的所有选项
      const _selected = this.selected.slice(0, index)
      // 将新选中项的值添加到_selected数组中
      _selected.push(this.getItemValue(data))
      this.selected = _selected

      // 使用$nextTick确保DOM更新后执行以下操作:
      this.$nextTick(() => {
        this.$refs.popper.updatePosition()

        // 如果选中的项目有子项,重置子项的滚动位置:
        // reset children scrolltop
        if (data.children && data.children.length > 0) {
          const options = this.$el.querySelectorAll('.bee-cascader-item-options')
          const lastOption = options[options.length - 1]
          lastOption.querySelector('.options--item').parentNode.scrollTop = 0
        }

        switch (this.type) {
          case 'last':
            // !(data.children && data.children.length > 0) 表示这是最后一项子元素
            if (!(data.children && data.children.length > 0)) this.onPick(_selected)
            break
          case 'every':
            // every模式，每次选择元素（不管是不是最后一个元素）都会触发pick回调
            this.onPick(_selected, !data.children)
            break
        }
      })
    }
  },
  watch: {
    'selected': function (value) {
      this.updateOptions(value)
    }
  }
}
</script>
