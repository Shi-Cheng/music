<template>
  <transition name="slide">
    <music-list />
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
export default {
  name: 'SingerDetail',
  components: {
    MusicList
  },
  data() {
    return { }
  },
  methods: {}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
