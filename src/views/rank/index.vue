<template>
  <div ref="rank" class="rank">
    <scroll v-show="topList.length" ref="toplist" class="toplist">
      <ul>
        <li v-for="(item, index) in topList" :key="index" class="item" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.picUrl" width="100" height="100">
          </div>
          <ul class="songlist">
            <li v-for="(song, songIndex) in item.songList" :key="songIndex" class="song">
              <span>{{ songIndex + 1 }}</span>
              <span>{{ song.songname }}-{{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div v-show="!topList.length" class="loading-container">
        <loading/>
      </div>
    </scroll>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from '../../base/loading/loading'
import Scroll from '../../base/scroll/scroll'
import { getTopList } from '../../api/rank'
import { ERR_OK } from '../../api/config'
import { mapMutations } from 'vuex'

export default{
  name: 'MusicRank',
  components: {
    Loading,
    Scroll
  },
  data() {
    return {
      topList: []
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/id${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
