/**
* 播放页面
*/
<template>
  <div v-show="playlist.length > 0" class="player">
    <transition
      name="normal"
      @enter="enter"
      @afterEnter="afterEnter"
      @leave="leave"
      @afterLeave="afterLeave"
    >
      <div v-show="fullScreen" class="normal-player">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"/>
          </div>
          <h1 class="title" v-html="currentSong.name"/>
          <h2 class="subtitle" v-html="currentSong.singer"/>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend.prevent="middleTouchEnd">
          <div ref="middleL" class="middle-l">
            <div ref="cdWrapper" class="cd-wrapper">
              <div :class="cdCls" class="cd" >
                <img :src="currentSong.image" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playLyric }}</div>
            </div>
          </div>
          <scroll
            ref="lyricList"
            :data="currentLyric && currentLyric.lines"
            class="middle-r">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  v-for="(line, index) in currentLyric.lines"
                  ref="lyricLine"
                  :key="index"
                  :class="{'current': currentLyricNumber === index}"
                  class="text">{{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span :class="{'active': currentShow === 'cd' }" class="dot"/>
            <span :class="{'active': currentShow === 'lyric' }" class="dot" />
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent="percent"
                @percentChange="onProgressBarChange"/>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"/>
            </div>
            <div :class="disableCls" class="icon i-left">
              <i class="icon-prev" @click="prev"/>
            </div>
            <div :class="disableCls" class="icon i-center">
              <i :class="playIcon" @click="togglePlaying"/>
            </div>
            <div :class="disableCls" class="icon i-right">
              <i class="icon-next" @click="next"/>
            </div>
            <div class="icon i-right">
            <i :class="getFavoriteIcon(currentSong)" class="icon" @click="toggleFavorite(currentSong)"/></div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div v-show="!fullScreen" class="mini-player" @click="open">
        <div class="icon">
          <img :src="currentSong.image" :class="cdCls" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"/>
          <p class="desc" v-html="currentSong.singer"/>
        </div>
        <div class="control">
          <progress-circle :percent="percent" :radius="radius">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"/>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"/>
        </div>
      </div>
    </transition>
    <play-list ref="palylist"/>
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    />
  </div>
</template>

<script>
import ProgressCircle from '../../base/progress-circle/progress-circle'
import ProgressBar from '../../base/progress-bar/progress-bar'
import Scroll from '../../base/scroll/scroll'
import PlayList from '../playlist/playlist'
import animations from 'create-keyframe-animation'
import { prefixStyle } from '../../common/js/dom'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '../../common/js/config'
import Lyric from 'lyric-parser'
import { playerMixin } from '../../common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  name: 'Player',
  components: {
    ProgressBar,
    ProgressCircle,
    PlayList,
    Scroll
  },
  mixins: [playerMixin],
  data() {
    return {
      playState: false,
      songReady: false, // 标识位，检测避免快速切歌引起的问题
      currentTime: 0, // 当前播放时间
      radius: 32,
      currentLyric: null,
      currentLyricNumber: 0,
      currentShow: 'cd',
      playLyric: ''
    }
  },
  computed: {
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playing',
      'currentIndex'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      // 切换模式，保证切换歌曲时依旧保持当前的播放状态
      if (newSong.id === oldSong.id) {
        return
      }
      // 切歌 歌词来回闪动
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime = 0
        this.playLyric = ''
        this.currentLyricNumber = 0
      }
      // 防止频繁切歌
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    //
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  created() {
    // created 中的属性并不需要创建set和get， touch只需要监听操作行为
    this.touch = {}
  },
  methods: {
    showPlayList() {
      this.$refs.palylist.show()
    },
    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 当纵轴的偏移大于横轴的偏移，不应该滚动
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      // 左右滑动的偏移
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      // 滑动的百分比
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd(e) {
      // 从右向左
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          opacity = 0
          offsetWidth = -window.innerWidth
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
    },
    end() {
      // 当前歌曲播放完毕，切换到下一首
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    updateTime(e) {
      // 获取当前播放时间
      this.currentTime = e.target.currentTime
    },
    ready() {
      // 当歌曲加载成功时
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error() {
      // 当歌曲加载失败都会触发error函数
      this.songReady = true
    },
    next() {
      // 判断快速切换是否准备
      if (!this.songReady) {
        return
      }
      // 处理边界值，当只有1首歌曲时， setCurrentIndex不会变化，之后的逻辑都会不会执行
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        // 判断是否为最后一首歌
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        // 歌词偏移到最开始
        this.currentLyric.seek(0)
      }
    },
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        // 判断是否为第一首歌, 处理为单曲循环
        this.loop()
        return
      } else {
        const index = this.currentIndex - 1
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()

      // 定义坐标变化
      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      // 预设animations
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      // 启动animations
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      // after done and then reset style
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      // 从大的播放器到小的
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0),scale(${scale})`
      // 执行transition结束函数，返回done
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale() {
      // 获取中心坐标
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      // 大的播放器的宽度
      const width = window.innerWidth * 0.8
      // 初始的缩放比例
      const scale = targetWidth / width
      // 距离变化
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    format(interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    onProgressBarChange(percent) {
      // 拖动进度条派发的事件，保证播放的时间与拖动的进度一致
      const time = this.currentSong.duration * percent
      this.$refs.audio.currentTime = time
      if (!this.playing) {
        this.togglePlaying()
      }
      // 拖动滚动条保证歌词与之同步
      if (this.currentLyric) {
        this.currentLyric.seek(time * 1000)
      }
    },
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        if (!this.playing) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        // 异常
        this.currentLyric = null
        this.playLyric = ''
        this.currentLyricNumber = 0
      })
    },
    handleLyric({ lineNum, txt }) {
      // 播放歌曲的当前播放行
      this.currentLyricNumber = lineNum
      if (lineNum > 5) {
        const lineEl = this.$refs.lyricLine[lineNum - 5]
        // 滚动到中间部分
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        // 滚动到顶部
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playLyric = txt
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
