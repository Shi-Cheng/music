<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"/>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '../../views/music-list/music-list'
import { getMusicList } from '../../api/rank'
import { ERR_OK } from '../../api/config'
import { createSong } from '../../common/js/song'
import { mapGetters } from 'vuex'
import { getSongVkey } from '../../api/recommend'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      const ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albummid) {
          getSongVkey(musicData.songmid).then((res) => {
            if (res.code === ERR_OK) {
              const vkey = res.data.items[0].vkey
              if (vkey) {
                ret.push(createSong(musicData, vkey))
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
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
