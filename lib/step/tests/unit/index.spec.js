import { shallowMount } from "@vue/test-utils"
import { expect } from 'chai'
import { delay } from "../../../../tests/helpers"
import BeeIcon from '../../../icon/_src/index.vue'
import BeeStep from '../../../step/_src/index.vue'
import helpers from '../../../utils/helpers'
import { config } from './_data'

function _createWrapper(options = {}) {
  return shallowMount(BeeStep, {
    stubs: {
      'bee-icon': BeeIcon
    },
    ...options
  })
}

describe(`\x1b[46m bee-step \x1b[0m`, () => {
  describe(`The prop of "labels"`, () => {
    const wrapper = _createWrapper({
      propsData: {
        config: config
      }
    })
    const items = wrapper.findAll('.bee-step--item')

    it(`render items length`, () => {
      expect(items.length).to.eq(config.length)
    })

    it(`render item content`, () => {
      items.wrappers.forEach((_wrapper, key) => {
        if(config[key].label) {
          expect(_wrapper.find('.bee-step-item--label').text()).to.eq(config[key].label)
        }

        if (config[key].desc) {
          expect(_wrapper.find('.bee-step-item--desc').text()).to.eq(config[key].desc)
        }

        if (helpers.typeof(config[key], 'string')) {
          expect(_wrapper.find('.bee-step-item--label').text()).to.eq(config[key])
        }
      })
    })
  })

  describe(`The prop of "step"`, () => {
    const wrapper = _createWrapper({
      propsData: {
        config: config
      }
    })

    it(`the first child should be active`, () => {
      expect(wrapper.findAll('.bee-step--item').at(0).classes()).to.contain('bee-step--item__active')
    })

    it(`let step should be active`, async () => {
      wrapper.setProps({
        step: 4
      })
      await delay(10)

      wrapper.findAll('.bee-step--item').wrappers.forEach((_wrapper, key) => {
        //  key is array index, from 0 to 3, it means step 1 to 4
        if (key < 4) {
          expect(_wrapper.classes()).to.contain('bee-step--item__active')
        } else {
          // step 5 is not active
          expect(_wrapper.classes()).not.contain('bee-step--item__active')
        }
      })
    })
  })
})
