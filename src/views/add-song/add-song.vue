<template>
  <transition name="slide">
    <div v-show="showFlag" class="add-song" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"/>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box
          ref="searchBox"
          placeholder="搜索歌曲"
          @query="onQueryChange"/>
      </div>
      <div v-show="!query" class="shortcut">
        <switches
          :switches="switches"
          :current-index="currentIndex"
          @switch="switchItem"/>
        <div class="list-wrapper">
          <scroll v-if="currentIndex === 0" ref="songlist" :data="playHistory" class="list-scroll">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"/>
            </div>
          </scroll>
          <scroll v-if="currentIndex === 1" ref="searchlist" :refresh-delay="refreshDelay" :data="searchHistory" class="list-scroll">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory" />
            </div>
          </scroll>
        </div>
      </div>

      <div v-show="query" class="search-result">
        <suggest
          :query="query"
          :show-singer="showSinger"
          @select="selectSuggest"
          @listScroll="blurInput"/>
      </div>
      <top-tip ref="topTip" :delay="delay">
        <div class="tip-title">
          <i class="icon-ok"/>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from '../../base/search-box/search-box'
import Suggest from '../suggest/suggest'
import Switches from '../../base/switches/switches'
import Scroll from '../../base/scroll/scroll'
import { searchMixin } from '../../common/js/mixin'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import SongList from '../../base/song-list/song-list'
import Song from '../../common/js/song'
import SearchList from '../../base/search-list/search-list'
import TopTip from '../../base/top-tip/top-tip'

export default {
  components: {
    TopTip,
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList
  },
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      delay: 2000,
      refreshDelay: 200,
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  methods: {
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
      }
      this.setFullScreen(true)
      this.showTip()
    },
    selectSuggest() {
      this.saveSearch()
      this.showTip()
    },
    switchItem(i) {
      this.currentIndex = i
    },
    showTip() {
      this.$refs.topTip.show()
    },
    show() {
      this.showFlag = true
      if (this.currentIndex === 0) {
        this.$refs.songlist.refresh()
      } else {
        this.$refs.searchlist.refresh()
      }
    },
    hide() {
      this.showFlag = false
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
