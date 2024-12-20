import {shallowMount} from "@vue/test-utils"
import {expect} from 'chai'
import Vue from 'vue'
import {delay} from "../../../../tests/helpers"
import BeeButton from '../../../button/_src/index.vue'
import BeeDialog from '../../../dialog/_src/index.vue'
import BeeIcon from '../../../icon/_src/index.vue'
import BeeUI from '../../../index'

Vue.use(BeeUI)

// 只关心子元素，忽略动画
const transitionStub = () => ({
  render: function(h) {
    return this.$options._renderChildren
  }
})

function _createWrapper(options = {}) {
  return shallowMount(BeeDialog, {
    stubs: {
      'transition': transitionStub(),
      'bee-icon': BeeIcon,
      'bee-button': BeeButton
    },
    ...options
  })
}

describe(`\x1b[46m bee-dialog \x1b[0m`, () => {
  describe(`default render`, () => {
    const wrapper = _createWrapper({
      propsData: {
        value: true
      }
    })

    it(`title should be visible`, () => {
      expect(wrapper.find('.bee-dialog-title--text').exists()).to.ok
      expect(wrapper.find('.bee-dialog-title--text').text()).to.ok
    })

    it(`close btn should exists`, () => {
      expect(wrapper.find('.bee-dialog--close').exists()).to.ok
    })

    it(`content text should be ""`, () => {
      expect(wrapper.find('.bee-dialog--body').text()).to.eq("")
    })

    it(`cancel button should exists`, () => {
      expect(wrapper.find('.bee-dialog--btn__cancel').exists()).to.ok
      expect(wrapper.find('.bee-dialog--btn__cancel').text()).to.ok
    })

    it(`confirm button should exists`, () => {
      expect(wrapper.find('.bee-dialog--btn__confirm').exists()).to.ok
      expect(wrapper.find('.bee-dialog--btn__confirm').text()).to.ok
    })
  })

  describe(`The option of "title"`, () => {
    it(`should be set`, async () => {
      const title = 'custom title'
      const wrapper = _createWrapper({
        propsData: {
          value: true,
          title: title
        }
      })
      await delay(300)
      expect(wrapper.find('.bee-dialog-title--text').text()).to.eq(title)
    })
  })

  describe(`The option of "width"`, () => {
    it(`default`, async () => {
      const wrapper = _createWrapper({
        propsData: {
          value: true
        }
      })
      await delay(300)
      // width: 500px; 这个是硬编码的初始值
      expect(wrapper.find('.bee-dialog--panel').attributes('style')).to.contains('width: 500px;')
    })

    it(`The width should be the set value`, async () => {
      const wrapper = _createWrapper({
        propsData: {
          value: true,
          width: '80%'
        }
      })
      await delay(300)
      expect(wrapper.find('.bee-dialog--panel').attributes('style')).to.contains('width: 80%;')
    })
  })

  describe(`The option of "loading"`, () => {
    it(`default`, async () => {
      const wrapper = _createWrapper({
        propsData: {
          value: true,
          loading: true
        }
      })
      await delay(300)
      // 这里只显示loading，而没有关闭loading的逻辑，因此可以根据元素来验证loading的存在性
      expect(wrapper.find('.bee-loading').exists()).to.ok
    })
  })

  describe(`The option of "sync"`, () => {
    it(`default`, async function () {
      this.timeout(50000)
      const wrapper = _createWrapper({
        propsData: {
          value: true
        },
        listeners: {
          input: (value) => {
            wrapper.setProps({ value})
          }
        }
      })
      await delay(300)
      // 一开始为显示状态
      expect(wrapper.isEmpty()).not.ok

      // 点击确认后，等待后关闭显示
      wrapper.find('.bee-dialog--btn__confirm').trigger('click')
      await delay(500)
      expect(wrapper.isEmpty()).to.ok
    })

    it(`is async`, async function () {
      this.timeout(50000)
      const wrapper = _createWrapper({
        propsData: {
          value: true,
          sync: false
        },
        listeners: {
          input: (value) => {
            wrapper.setProps({value})
          },
          // 确认后，等待 event loop 下一次检查，大约在 500ms 后执行
          confirm: (done) => {
            setTimeout(done, 500)
          }
        }
      })
      await delay(300)
      // 一开始显示
      expect(wrapper.isEmpty()).not.ok

      // 点击后，等待时间短于上面 setTimeout 的时长，因此还是显示状态
      wrapper.find('.bee-dialog--btn__confirm').trigger('click')
      await delay(400)
      expect(wrapper.isEmpty()).not.ok

      // confirm total delay = 400 + 150 > 500ms
      await delay(150)
      expect(wrapper.isEmpty()).to.ok
    })
  })

  describe(`The option of "closeVisible"`, () => {
    it(`close button should be non-exists`, async () => {
      const wrapper = _createWrapper({
        propsData: {
          value: true,
          closeVisible: false
        }
      })

      await delay(300)
      expect(wrapper.find(BeeIcon).exists()).not.ok
    })
  })

  describe(`The option of "cancelVisible"`, () => {
    it(`cancel button should be non-exists`, async () => {
      const wrapper = _createWrapper({
        propsData: {
          value: true,
          cancelVisible: false
        }
      })

      await delay(300)
      expect(wrapper.find('.bee-dialog--btn__cancel').exists()).not.ok
    })
  })

  describe(`The option of "cancelText"`, () => {
    it(`cancel button text should be the set value`, async () => {
      const cancelText = 'cancel tap'
      const wrapper = _createWrapper({
        propsData: {
          value: true,
          cancelText
        }
      })

      await delay(300)
      expect(wrapper.find('.bee-dialog--btn__cancel').text()).to.eq(cancelText)
    })
  })

  describe(`The option of "confirmVisible"`, () => {
    it(`confirm button should be non-exists`, async () => {
      const wrapper = _createWrapper({
        propsData: {
          value: true,
          confirmVisible: false
        }
      })

      await delay(300)
      expect(wrapper.find('.bee-dialog--btn__confirm').exists()).not.ok
    })
  })

  describe(`The option of "confirmText"`, () => {
    it(`confirm button should be non-exists`, async () => {
      const confirmText = 'confirm tap'
      const wrapper = _createWrapper({
        propsData: {
          value: true,
          confirmText
        }
      })

      await delay(300)
      expect(wrapper.find('.bee-dialog--btn__confirm').text()).to.eq(confirmText)
    })
  })

  describe(`The events`, () => {
    const count = {
      beforeEnter: 0,
      afterLeave: 0,
      close: 0,
      cancel: 0,
      confirm: 0
    }
    const wrapper = _createWrapper({
      listeners: {
        input: (value) => {
          wrapper.setProps({value})
        },
        beforeEnter: () => {
          count.beforeEnter++
        },
        afterLeave: () => {
          count.afterLeave++
        },
        close: () => {
          count.close++
        },
        cancel: () => {
          count.cancel++
        },
        confirm: () => {
          count.confirm++
        }
      }
    })

    it('close', async () => {
      wrapper.setProps({value: true})
      await delay(300)
      wrapper.find('.bee-dialog--close').trigger('click')
      await delay(300)
      expect(count.close).to.eq(1)
    })

    it('cancel', async () => {
      wrapper.setProps({value: true})
      await delay(300)
      wrapper.find('.bee-dialog--btn__cancel').trigger('click')
      await delay(300)
      // cancel 之后，会触发 close 函数
      expect(count.close).to.eq(2)
      expect(count.cancel).to.eq(1)
    })

    it('confirm', async () => {
      wrapper.setProps({value: true})
      await delay(300)
      wrapper.find('.bee-dialog--btn__confirm').trigger('click')
      await delay(300)

      expect(count.close).to.eq(2)
      expect(count.cancel).to.eq(1)
      expect(count.confirm).to.eq(1)
    })
  })
})
