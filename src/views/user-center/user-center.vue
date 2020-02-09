<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="hide">
        <i class="icon-back"/>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :current-index="currentIndex" @switch="switchItem"/>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"/>
        <span class="text">随机播放全部</span>
      </div>
      <div ref="listWrapper" class="list-wrapper">
        <scroll v-if="currentIndex === 0" ref="favoritelist" :data="favoriteList" class="list-scroll">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"/>
          </div>
        </scroll>
        <scroll v-if="currentIndex === 1" ref="playList" :data="playHistory" class="list-scroll">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"/>
          </div>
        </scroll>
      </div>
      <div v-show="noResult" class="no-result-wrapper">
        <no-result :title="noResultDesc" />
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from '../../base/scroll/scroll'
import Switches from '../../base/switches/switches'
import NoResult from '../../base/no-result/no-result'
import SongList from '../../base/song-list/song-list'
import Song from '../../common/js/song.js'
import { playlistMixin } from '../../common/js/mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    NoResult,
    SongList,
    Scroll,
    Switches
  },
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ]
    }
  },
  computed: {
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂未收藏歌曲'
      } else {
        return '暂无播放歌曲'
      }
    },
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    ...mapGetters([
      'playHistory',
      'favoriteList'
    ])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoritelist && this.$refs.favoritelist.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      list = list.map((song) => {
        return new Song(song)
      })
      this.randomPlay({
        list
      })
    },
    hide() {
      this.$router.back()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song) {
      this.insertSong(new Song(song))
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
