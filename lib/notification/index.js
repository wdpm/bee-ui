import MessagePanel from './_src/index.vue'

const distance = 10
let stack = []

export default {
  install: function (Vue) {
    const Constructor = Vue.extend(MessagePanel)

    Vue.prototype.$_createNotification = function (options = {}) {
      // Filter the options of bee-message.
      let _data = Object.entries(options).reduce((acc, [key, item]) => {
        if (/^(type|title|message|duration)$/.test(key) && item !== undefined && item !== null) {
          acc[key] = item
        }

        return acc
      }, {})

      // Get the instance of BeeNotification.
      const instance = new Constructor({
        name: 'BeeNotification',
        data: _data,
        methods: {
          beforeEnter () {
            let top = distance

            // Update item the top of position.
            stack.forEach((item) => {
              if (item.open) {
                // record current top to self
                item.boundingTop = top
                // update next top value
                top += (item.$el.offsetHeight + distance)
              }
            })

            instance._showstamp = Date.now()
            instance.boundingTop = top
            stack.push(instance)
          },

          beforeLeave () {
            // _uid是 vue内部参数，可以考虑自己生成一个UID
            const index = stack.findIndex(item => item._uid === instance._uid)

            if (index === -1) return

            stack.splice(index, 1)
            // 记录后面要减少的高度
            const _height = instance.$el.offsetHeight + distance

            // 根据时间戳先后顺序，找出那些在当前即将删除item后面的items，
            // 这些items都要减去上面计算的这个高度
            stack.forEach(item => {
              if (item._showstamp >= instance._showstamp) {
                item.boundingTop -= _height
              }
            })
          }
        }
      }).$mount()

      return instance
    }
  }
}
