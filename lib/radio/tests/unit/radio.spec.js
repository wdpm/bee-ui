import { shallowMount } from '@vue/test-utils'
import { expect } from 'chai'
import { delay } from "../../../../tests/helpers"
import BeeIcon from '../../../icon/_src/index.vue'
import BeeRadio from '../../../radio/_src/radio-item.vue'

function _createWrapper(options = {}) {
  return shallowMount(BeeRadio, {
    stubs: {
      'bee-icon': BeeIcon
    },
    ...options
  })
}

describe(`\x1b[46m bee-radio \x1b[0m`, () => {
  describe(`The prop of "icons"`, () => {
    const wrapper = _createWrapper({
      propsData: {
        icons: [{
          icon: 'user'
        }, {
          icon: 'mobile'
        }]
      }
    })

    it(`the unselect icon should be setted`, () => {
      expect(wrapper.findAll(BeeIcon).at(0).classes()).to.contain('bee-user')
    })

    it(`the select icon should be setted`, () => {
      expect(wrapper.findAll(BeeIcon).at(1).classes()).to.contain('bee-mobile')
    })

    it(`the unselect icon should be visible`, () => {
      expect(wrapper.findAll(BeeIcon).at(0).isVisible()).to.ok
    })

    it(`the select icon should be invisible`, () => {
      expect(wrapper.findAll(BeeIcon).at(1).isVisible()).to.false
    })
  })

  describe(`The prop of "disabled"`, () => {
    const wrapper = _createWrapper({
      propsData: {
        disabled: true
      }
    })

    it(`init with default value`, () => {
      expect(wrapper.findAll(BeeIcon).at(0).isVisible()).to.ok
      expect(wrapper.findAll(BeeIcon).at(1).isVisible()).to.false
    })

    it(`event disabled`, () => {
      wrapper.trigger('click')
      expect(wrapper.findAll(BeeIcon).at(0).isVisible()).to.ok
      expect(wrapper.findAll(BeeIcon).at(1).isVisible()).to.false
    })
  })

  describe(`The slots`, () => {
    it(`default slots`, () => {
      const wrapper = _createWrapper({
        slots: {
          default: ['test content']
        }
      })
      expect(wrapper.text()).to.contain('test content')
    })
  })

  describe('The events', () => {
    it(`v-model`, async () => {
      const wrapper = _createWrapper({
        listeners: {
          input: (value) => {
            wrapper.setProps({ value })
          }
        }
      })

      // init with prop value
      expect(wrapper.findAll(BeeIcon).at(0).isVisible()).is.ok
      expect(wrapper.findAll(BeeIcon).at(1).isVisible()).not.ok
      expect(wrapper.props('value')).to.a('boolean').not.ok

      // change status
      wrapper.trigger('click')
      await delay(10)
      expect(wrapper.findAll(BeeIcon).at(0).isVisible()).not.ok
      expect(wrapper.findAll(BeeIcon).at(1).isVisible()).is.ok
      expect(wrapper.props('value')).to.a('boolean').is.ok
    })

    const events = ['click', 'change', 'mouseenter', 'mouseleave']

    events.forEach((_event) => {
      it(`${_event}`, async () => {
        let eventType = null
        let listeners = {}

        listeners[_event] = (e) => {
          eventType = _event
        }

        const wrapper = _createWrapper({
          listeners: listeners
        })


        // wrapper.trigger(_event)
        //  AssertionError: expected null to equal 'change'

        // 因为change事件没法测试pass，所以这里相当于特别修复。而input事件已经被vue自动代理了，因此可以直接通过。
        if (_event === 'change') {
          wrapper.find('input[type="radio"]').element.checked = !wrapper.vm.checked
          wrapper.find('input[type="radio"]').trigger('change')
        } else {
          wrapper.trigger(_event)
        }

        await delay(10)
        expect(eventType).to.eq(_event)
      })
    })
  })
})
