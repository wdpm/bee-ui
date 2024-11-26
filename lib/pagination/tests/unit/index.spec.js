import { shallowMount } from '@vue/test-utils'
import { expect } from 'chai'
import Vue from 'vue'
import { delay } from '../../../../tests/helpers'
import BeeButton from '../../../button/_src/index.vue'
import BeeUI from '../../../index'
import BeeInput from '../../../input/_src/index.vue'
import BeePagination from '../../../pagination/_src/index.vue'

Vue.use(BeeUI)

function _createWrapper (options = {}) {
  return shallowMount(BeePagination, {
    stubs: {
      'bee-input': BeeInput,
      'bee-button': BeeButton
    },
    ...options
  })
}

describe(`\x1b[46m bee-pagination \x1b[0m`, () => {
  describe(`The prop of "pageTotal"`, () => {
    it(`when the value is undefined, the wrapper should be empty`, () => {
      const wrapper = _createWrapper()
      expect(wrapper.isEmpty()).to.ok
    })

    it(`when the value lt 1, the wrapper should be empty`, () => {
      const wrapper = _createWrapper({
        propsData: {
          pageTotal: 0
        }
      })
      expect(wrapper.isEmpty()).to.ok
    })

    it(`when the value gt 0, the wrapper should not be empty`, () => {
      const wrapper = _createWrapper({
        propsData: {
          pageTotal: 10
        }
      })
      expect(wrapper.isEmpty()).not.ok
    })

    it(`when the value is 1, the buttons should be disabled`, () => {
      const wrapper = _createWrapper({
        propsData: {
          pageTotal: 1
        }
      })
      wrapper.findAll(BeeButton).wrappers.forEach(item => {
        expect(item.attributes('disabled')).to.ok
      })
    })

    it(`when the value gt 1, the input handler should be exists`, () => {
      const wrapper = _createWrapper({
        propsData: {
          pageTotal: 10
        }
      })
      expect(wrapper.find('.bee-pagination--quick').exists()).to.ok
    })
  })

  describe(`The prop of "page"`, () => {
    it('the current button will be acitve', async () => {
      const wrapper = _createWrapper({
        propsData: {
          pageTotal: 10,
          page: 2
        }
      })
      expect(wrapper.findAll('.bee-pagination--button').at(2).classes()).to.includes('bee-pagination--button__active')

      wrapper.setProps({
        page: 2
      })
      await delay(10)
      expect(wrapper.findAll('.bee-pagination--button').at(2).classes()).to.contain('bee-pagination--button__active')
    })
  })

  describe(`The prop of "total"`, () => {
    it(`the value is undefined or eq 0, the total will be not exists`, async () => {
      const wrapper = _createWrapper({
        propsData: {
          page: 1,
          pageTotal: 10
        }
      })
      expect(wrapper.find('.bee-pagination--total').exists()).not.ok

      wrapper.setProps({
        total: 0
      })
      expect(wrapper.find('.bee-pagination--total').exists()).not.ok

      wrapper.setProps({
        total: 10
      })
      await delay(10)
      expect(wrapper.find('.bee-pagination--total').exists()).to.ok
    })
  })

  describe(`The prop of "totalVisible"`, () => {
    const wrapper = _createWrapper({
      propsData: {
        page: 1,
        pageTotal: 10,
        total: 200
      }
    })

    it(`default`, () => {
      expect(wrapper.find('.bee-pagination--total').exists()).to.ok
    })

    it(`the value is false, total tap should be not exists`, async () => {
      wrapper.setProps({
        totalVisible: false
      })

      await delay(10)
      expect(wrapper.find('.bee-pagination--total').exists()).not.ok
    })
  })

  describe(`The prop of "maxlength"`, () => {
    it(`the number of consecutive page button should be gt 0 and lt maxlength`, async () => {
      const wrapper = _createWrapper({
        propsData: {
          page: 1,
          pageTotal: 10
        }
      })
      // pages
      // [1, 2, 3, 4, 5, null, 10]

      // UI elements
      // acc -1 cur.text() 上一页
      // acc -1 cur.text() 1
      // acc 1 cur.text() 2
      // acc 2 cur.text() 3
      // acc 3 cur.text() 4
      // acc 4 cur.text() 5
      // acc 5 cur.text() 10
      // acc 5 cur.text() 下一页
      // acc 5 cur.text() 确定

      let _length = wrapper.findAll(BeeButton).wrappers.reduce((acc, cur) => {
        // console.log('acc', acc, 'cur.text()', cur.text())
        if (acc < 0 && cur.text() === '1') {
          acc = 1
        } else if (acc > 0 && cur.text() === (acc + 1).toString()) {
          acc++
        }

        return acc
      }, -1)
      expect(_length > 0 && _length <= wrapper.props('maxlength')).to.ok

      // pages
      // [1, null, 3, 4, 5, 6, 7, null, 10]

      // UI elements
      // acc -1 cur.text() 上一页
      // acc -1 cur.text() 1
      // acc 1 cur.text() 3
      // acc 1 cur.text() 4
      // acc 1 cur.text() 5
      // acc 1 cur.text() 6
      // acc 1 cur.text() 7
      // acc 1 cur.text() 10
      // acc 1 cur.text() 下一页
      // acc 1 cur.text() 确定
      wrapper.setProps({
        page: 5
      })
      await delay(300)

      let newAccStart = null
      let previousPageNumber= null
      _length = wrapper.findAll(BeeButton).wrappers.reduce((acc, cur) => {
        console.log('acc', acc, 'cur.text()', cur.text())
        if (acc < 0 && cur.text() === '1') {
          acc = 1
        } else {
          // has previous gap, for example  1,...,3 and has not initialized newAccStart yet
          if (acc > 0 && cur.text() > (acc + 1) && !newAccStart) {
            previousPageNumber = Number(cur.text())
            // reset computation
            newAccStart = parseInt(cur.text(), 10)
            acc = 1
          } else if (acc > 0 && cur.text() === (previousPageNumber + 1).toString()) {
            previousPageNumber = Number(cur.text())
            acc++
          }
        }

        return acc
      }, -1)
      console.log('length: ', _length)
      expect(_length > 0 && _length <= wrapper.props('maxlength')).to.ok
    })

  })

  describe(`The events`, () => {
    it('change', async () => {
      const wrapper = _createWrapper({
        propsData: {
          pageTotal: 10,
          page: 1
        },
        listeners: {
          change: (page) => {
            wrapper.setProps({ page })
          }
        }
      })

      wrapper.findAll(BeeButton).at(1).trigger('click')
      expect(wrapper.props('page')).to.eq(1)

      // page button
      wrapper.findAll(BeeButton).at(2).trigger('click')
      await delay(10)
      expect(wrapper.props('page')).to.eq(2)

      // page input
      wrapper.find(BeeInput).find('input').setValue(8)
      wrapper.findAll(BeeButton).wrappers.find(item => item.text() === item.vm.$_language('CONFIRM')).trigger('click')
      await delay(10)
      expect(wrapper.props('page')).to.eq(8)
    })
  })
})
