import helpers from '../utils/helpers'
import LoadingBody from './_src/index.vue'

let instances = {}

export default {
  install: function (Vue) {
    const Constructor = Vue.extend(LoadingBody)

    Vue.prototype.$_createLoading = function (options) {
      let instance = new Constructor({
        data: helpers.clearEmpty(options)
      }).$mount()

      return instance
    }

    Vue.directive('loading', {
      inserted: function (el, binding, vnode) {
        if (!binding.value) return

        const { loadingType, loadingBlock, loadingText } = el.dataset
        const instance = Vue.prototype.$_createLoading(helpers.clearEmpty({
          parent: el,
          type: loadingType,
          block: !/(false)/.test(loadingBlock),
          text: loadingText
        })).show()

        el.dataset.loadingId = instance._uid
        instances[instance._uid] = instance
      },
      update: function (el, binding) {
        //  不变，直接返回
        if (binding.value === binding.oldValue) return

        // 绑定value存在，新建
        if (binding.value) {
          const { loadingType, loadingBlock, loadingText } = el.dataset
          const instance = Vue.prototype.$_createLoading(helpers.clearEmpty({
            parent: el,
            type: loadingType,
            block: !/(false)/.test(loadingBlock),
            text: loadingText
          })).show()

          el.dataset.loadingId = instance._uid
          instances[instance._uid] = instance
        } else {
          // 当绑定value不存在

          // 查询缓存，缓存miss就直接返回
          if (!instances[el.dataset.loadingId]) return

          // 缓存中存在，执行清理
          instances[el.dataset.loadingId].hide()
          delete instances[el.dataset.loadingId]
          delete el.dataset.loadingId
        }
      },
      unbind: function (el) {
        if (!el.dataset || !instances[el.dataset.loadingId]) return

        instances[el.dataset.loadingId].hide()
        delete instances[el.dataset.loadingId]
        delete el.dataset.loadingId
      }
    })
  }
}
