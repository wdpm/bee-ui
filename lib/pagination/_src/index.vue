<template>
  <div class="bee-pagination" v-if="pageTotal">
    <!--    上一页-->
    <bee-button class="bee-pagination--button bee-pagination--button__prev"
                :disabled="prevDisabled"
                @click="prev"
    >{{ $_language('PREV_PAGE') }}
    </bee-button>

    <template v-for="(item, key) in pages">

      <!--      为何 pageTotal === 1 表示禁用状态？-->
      <bee-button v-if="item" :key="'button' + key"
                  :class="['bee-pagination--button', {
          'bee-pagination--button__active': item === page && pageTotal !== 1
        }]"
                  :disabled="pageTotal === 1"
                  @click="specifyPage(item)"
      >
        {{ item }}
      </bee-button>

      <span v-else :key="'button' + key"
            class="bee-pagination--button__more"
      >...</span>
    </template>

    <!--    下一页-->
    <bee-button class="bee-pagination--button bee-pagination--button__next"
                :disabled="nextDisabled"
                @click="next"
    >{{ $_language('NEXT_PAGE') }}
    </bee-button>

    <!-- 共 XX 条 -->
    <span class="bee-pagination--total" v-if="total && totalVisible">
      {{ $_language('PAGE_COUNT') }} <span>{{ total }}</span> {{ $_language('PAGE_UNIT') }}
    </span>

    <!--    快速跳转 -->
    <span class="bee-pagination--quick" v-if="pageTotal > 1">
      <bee-input class="page--input"
                 :placeholder="$_language('PAGE_PLACEHOLDER')"
                 :reg="insertReg"
                 @enter="confirm"
                 v-model="pageInsert"
      ></bee-input>

      <bee-button class="quick--button" theme="primary" @click="confirm">{{ $_language('CONFIRM') }}</bee-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'BeePagination',
  props: {
    // one-based, NOT zero-based
    page: {
      type: Number,
      default: 1
    },
    pageTotal: Number,
    total: Number,
    totalVisible: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number,
      validator: function (value) {
        // 大于等于 3 的奇数
        return value % 2 === 1 && value >= 3
      },
      default: 5
    }
  },
  data () {
    return {
      //  the page number that user inputs
      pageInsert: null
    }
  },
  computed: {
    pages () {
      if (!this.pageTotal) return

      const { pageTotal, page, maxlength } = this

      // null 元素的位置在 UI 中会显示为省略号

      // 假设 maxlength = 5, pageTotal = 6
      // 结果: [1, 2, 3, 4, 5, 6]
      // 这种情况下，无法在中间插入连续的页码显示 + ellipsis 环绕
      if (pageTotal < maxlength + 2) return this.pageRange(1, pageTotal)

      // 假设 maxlength = 5, pageTotal = 10, page = 3
      // 结果: [1, 2, 3, 4, 5, null, 10]
      // 这种情况适用于当前页在前半部分。
      if (page < maxlength) return this.pageRange(1, maxlength).concat([null, pageTotal])

      // 假设 maxlength = 5, pageTotal = 10, page = 8
      // 结果: [1, null, 5, 6, 7, 8, 9, 10]
      // 这种情况适用于当前页接近末尾。
      const split = Math.floor(maxlength / 2)
      if (page >= pageTotal - split) return [1, null].concat(this.pageRange(pageTotal - maxlength, pageTotal))

      // 其他情况(当前页在大约中间位置):
      // 例子: 假设 maxlength = 5, pageTotal = 10, page = 6
      // 结果: [1, null, 4, 5, 6, 7, 8, null, 10]
      // 显示第一页,省略号,当前页周围的页码,另一个省略号,最后一页。
      return [].concat([1, null], this.pageRange(page - split, page + split), [null, pageTotal])
    },
    prevDisabled () {
      return this.page <= 1
    },
    nextDisabled () {
      return this.page >= this.pageTotal
    },
    // 对快速跳转的input的检测
    insertReg () {
      return (page) => {
        page = Number(page)

        if (!page) return ''

        if (page <= 0 || page > this.pageTotal) return this.pageInsert

        return page
      }
    }
  },
  methods: {
    pageRange (start, end) {
      let _range = []
      while (start <= end) {
        _range.push(start++)
      }
      return _range
    },

    prev () {
      this.specifyPage(this.page - 1)
    },

    next () {
      this.specifyPage(this.page + 1)
    },

    specifyPage (page) {
      if (!page || page === this.page) return false
      this.$listeners.change && this.$listeners.change(page)
    },

    confirm () {
      const page = Number(this.pageInsert)
      page && this.specifyPage(page)
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
