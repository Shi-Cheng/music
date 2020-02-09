/**
* 歌手详情页
*/
<template>
  <scroll
    ref="listview"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    :data="data"
    class="listview"
    @scroll="scroll">
    <ul>
      <li v-for="(group, index) in data" ref="listGroup" :key="index" class="list-group">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <uL>
          <li
            v-for="(item,itemIndex) in group.items"
            :key="itemIndex"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <img v-lazy="item.avatar" class="avatar" >
            <span class="name">{{ item.name }}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
          :class="{'current': currentIndex === index}"
          class="item">{{ item }}</li>
      </ul>
    </div>
    <div v-show="fixedTitle" ref="fixed" class="list-fixed">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading />
    </div>
  </scroll>
</template>

<script>
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import { getData } from '../../common/js/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  name: 'ListView',
  components: {
    Scroll,
    Loading
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    // 获取A，B，C
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    // 对应字母
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      })
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length; i++) {
        const h1 = listHeight[i]
        const h2 = listHeight[i + 1]
        if (-newY >= h1 && -newY < h2) {
          this.currentIndex = i
          this.diff = h2 + newY
          return
        }
      }
      // 如果滚动到底部, 且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      const fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
    this.touch = {}
    this.listHeight = []
  },
  methods: {
    onShortcutTouchStart(e) {
      const anchorIndex = getData(e.target, 'index')
      const firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      // 计算移动最终的落脚点
      const firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      const delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      // 判断是否点击了收尾两处的空白位置
      if (!index && index === 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      // 计算每个分类所占的高度
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    selectItem(item) {
      this.$emit('select', item)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
