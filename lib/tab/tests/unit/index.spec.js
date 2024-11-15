import { shallowMount } from "@vue/test-utils"
import { expect } from 'chai'
import Vue from 'vue'
import { delay } from "../../../../tests/helpers"
import BeeUI from '../../../index'
import BeeTab from '../../../tab/_src/index.js'
import BeeTabItem from '../../../tab/_src/tab-item.vue'

Vue.use(BeeUI)

const slots = [
  `<bee-tab-item label='文章'>
    <div>
      这里是 文章 下面的内容
    </div>
  </bee-tab-item>`,
  `<bee-tab-item label='图片'>
    <div>
      这里是 图片 下面的内容
    </div>
  </bee-tab-item>`
]

function _createWrapper(options = {}) {
  return shallowMount(BeeTab, {
    stubs: {
      'bee-tab-item': BeeTabItem
    },
    ...options
  })
}

describe(`\x1b[46m bee-tab \x1b[0m`, () => {
  describe(`render`, () => {
    it(`if child does not contain bee-tab-item, the child is rendered empty.`, () => {
      const wrapper = _createWrapper()
      expect(wrapper.findAll('.bee-tab--label').length).to.eq(0)
      expect(wrapper.findAll('.bee-tab--item').length).to.eq(0)
    })
  })

  describe(`The prop of "type"`, () => {
    it(`default`, () => {
      const wrapper = _createWrapper({
        slots: {
          default: slots
        }
      })
      expect(wrapper.classes()).not.contain('bee-tab__card')
      expect(wrapper.findAll('.bee-tab--label').length).to.eq(2)
      // item 只会有一个
      expect(wrapper.findAll('.bee-tab--item').length).to.eq(1)
      expect(wrapper.findAll('.bee-tab--item').at(0).text()).to.contain('这里是 文章 下面的内容')
    })

    it(`card`, () => {
      const wrapper = _createWrapper({
        propsData: {
          type: 'card'
        },
        slots: {
          default: slots
        }
      })
      expect(wrapper.classes()).to.contain('bee-tab__card')
    })
  })

  describe(`The events`, () => {
    it(`v-model`, async () => {
      const wrapper = _createWrapper({
        propsData: {
          type: 'card'
        },
        slots: {
          default: slots
        },
        listeners: {
          input: (value) => {
            wrapper.setProps({ value })
          }
        }
      })

      // 初始活跃label
      expect(wrapper.findAll('.bee-tab--label').at(wrapper.props('value')).classes()).to.contain('bee-tab--label__active')
      wrapper.findAll('.bee-tab--label').at(1).trigger('click')
      await delay(10)
      expect(wrapper.props('value')).to.eq(1)
      // 当前活跃label
      expect(wrapper.findAll('.bee-tab--label').at(wrapper.props('value')).classes()).to.contain('bee-tab--label__active')
    })

    it(`change`, async () => {
      let _count = 0
      const wrapper = _createWrapper({
        propsData: {
          type: 'card'
        },
        slots: {
          default: slots
        },
        listeners: {
          input: (value) => {
            wrapper.setProps({ value })
          },
          change: () => {
            _count++
          }
        }
      })
      wrapper.findAll('.bee-tab--label').at(1).trigger('click')
      await delay(10)
      expect(_count).to.eq(1)

      // not changed, not increase count
      wrapper.findAll('.bee-tab--label').at(1).trigger('click')
      await delay(10)
      expect(_count).to.eq(1)

      wrapper.findAll('.bee-tab--label').at(0).trigger('click')
      await delay(10)
      expect(_count).to.eq(2)
    })
  })
})
