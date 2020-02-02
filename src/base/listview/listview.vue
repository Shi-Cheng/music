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
        <li v-for="(item, index) in shortcutList" :key="index" :data-index="index" class="item">{{ item }}</li>
      </ul>
    </div>
    <div ref="fixed" class="list-fixed">
      <div class="fixed-title"/>
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

export default {
  name: 'ListView',
  components: {
    Scroll,
    Loading
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1
    }
  },
  computed: {
    // 获取A，B，C
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  watch: {
    data() {
      return
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
    this.touch = {}
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
    },
    _scrollTo(index) {
      if (!index && index === 0){
        return
      }
    },
    scroll(pos) {
      this.scrollY = pos.y
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
