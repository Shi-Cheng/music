<!--播放条形进度显示-->
<template>
  <div ref="progressBar" class="progress-bar" @click="progressClick">
    <div class="bar-inner">
      <div ref="progress" class="progress"/>
      <div
        ref="progressBtn"
        class="progress-btn-wrapper"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent ="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"/>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from '../../common/js/dom'
const transform = prefixStyle('transform')
const progressBtnWidth = 16
export default {
  name: 'ProcessBar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPercent) {
      if (this.percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  },
  created() {
    // 创建一个记录集合
    this.touch = {}
  },
  methods: {
    progressClick(e) {
      // 计算点击位置
      // this._offset(e.offsetX) // 当点击progressBar时 e.offsetX获取不对，通过pageX进行解决
      const rect = this.$refs.progressBar.getBoundingClientRect() // 用于获取某个元素相对于视窗的位置集合
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    progressTouchStart(e) {
      // 记录
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      // 记录播放过程中进度条的长度
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      // 两次点击的偏移
      const deltaX = e.touches[0].pageX - this.touch.startX
      // 播放进度的控制最大值为条形条的长度，最小值为0
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd(e) {
      // 派发touchend.prevent 记录动作完成后的标识
      this.touch.initiated = false
      this._triggerPercent()
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent() {
      // 进度条的长度
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 当前播放进度条的长度
      const percent = this.$refs.progress.clientWidth / barWidth
      // 最后派发事件，更改percent
      this.$emit('percentChange', percent)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
