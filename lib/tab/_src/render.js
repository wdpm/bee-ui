export default {
  tabHeader (h) {
    // one tab bar + many tab labels = one tab section
    return (configures, barStyle, onChange) => {
      return h('section', {
        class: ['bee-tab--header']
      }, [
        h('div', {
          class: 'bee-tab-bar',
          style: barStyle
        })
      ].concat(
        configures.map((item, key) => {
          return h('div', {
            class: ['bee-tab--label', {
              'bee-tab--label__active': item.active
            }],
            on: {
              click: () => {
                onChange(key)
              }
            }
          }, [item.props.label])
        })
      ))
    }
  },
  tabBody (h) {
    return (slot, index) => {
      // 提供动画过渡
      return h('transition-group', {
        class: ['bee-tab--body'],
        // 这个props是提供给 transition-group 的
        props: {
          name: 'bee-tab',
          tag: 'section'
        }
      }, [
        // slot is a bee tab item => <section class="bee-tab--item"><div> 这里是 图片 下面的内容 </div></section>
        h('section', {
          key: index
        }, [slot])
      ])
    }
  }
}
