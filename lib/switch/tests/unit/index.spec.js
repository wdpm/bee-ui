import { shallowMount } from '@vue/test-utils'
import { expect } from 'chai'
import { delay } from '../../../../tests/helpers'
import BeeSwitch from '../../../switch/_src/index.vue'

function _createWrapper(options = {}) {
  return shallowMount(BeeSwitch, {
    stubs: {},
    ...options
  })
}

describe(`\x1b[46m bee-switch \x1b[0m`, () => {
  describe(`The prop of "size"`, () => {
    it(`sm`, () => {
      const wrapper = _createWrapper({
        propsData: {
          size: 'sm'
        }
      })
      expect(wrapper.classes()).to.include('bee-switch__sm')
    })

    it(`lg`, () => {
      const wrapper = _createWrapper({
        propsData: {
          size: 'lg'
        }
      })
      expect(wrapper.classes()).to.include('bee-switch__lg')
    })
  })

  describe(`The prop of "disabled"`, () => {
    const wrapper = _createWrapper({
      propsData: {
        disabled: true
      },
      listeners: {
        input: (value) => {
          wrapper.setProps({ value })
        }
      }
    })

    it(`wrapper classes should contain bee-switch__disabled`, () => {
      expect(wrapper.classes()).to.include('bee-switch__disabled')
    })

    it(`not open by click`, () => {
      wrapper.trigger('click')
      expect(wrapper.classes()).to.include('bee-switch__close')
    })

    it(`change status by value`, async () => {
      wrapper.setProps({
        value: true
      })
      await delay(10)
      expect(wrapper.classes()).to.include('bee-switch__open')
    })
  })

  describe(`The prop of "openColor" and "closeColor"`, () => {
    const wrapper = _createWrapper({
      propsData: {
        openColor: 'green',
        closeColor: 'red'
      }
    })

    it(`close color should be red`, () => {
      expect(wrapper.find('.bee-switch--after').attributes('style')).to.contain('background-color: red;')
    })

    it(`open color should be green`, () => {
      expect(wrapper.find('.bee-switch--before').attributes('style')).to.contain('background-color: green;')
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
      expect(wrapper.classes()).to.include('bee-switch__close')
      wrapper.trigger('click')
      await delay(10)
      expect(wrapper.classes()).to.include('bee-switch__open')
      expect(wrapper.props('value')).to.ok
    })


    it(`change`, async () => {
      const wrapper = _createWrapper({
        listeners: {
          change: (value) => {
            wrapper.setProps({ value })
          }
        }
      })
      wrapper.trigger('click')
      await delay(10)
      expect(wrapper.props('value')).to.ok
    })
  })
})
