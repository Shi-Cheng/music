<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"/>
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
import { mapGetters } from 'vuex'
import { ERR_OK } from '../../api/config'
import { getSingerDetail } from '../../api/singer'
import { getSongVkey } from '../../api/recommend'
import { createSong } from '../../common/js/song'

export default {
  name: 'SingerDetail',
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger(list) {
      if (!list.length) {
        return
      }
      const ret = []
      list.forEach((item) => {
        const { musicData } = item
        if (musicData.songid && musicData.albummid) {
          getSongVkey(musicData.songmid).then((res) => {
            if (res.code === ERR_OK) {
              const vkey = res.data.items[0].vkey
              if (vkey) {
                const newSong = createSong(musicData, vkey)
                ret.push(newSong)
              }
            }
          })
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
