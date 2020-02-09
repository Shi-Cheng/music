<template>
  <scroll
    ref="suggest"
    :data="result"
    :pullup="pullup"
    :before-scroll="beforeScroll"
    class="suggest"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li v-for="(item, index) in result" :key="index" class="suggest-item" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconClass(item)" />
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)" />
        </div>
      </li>
      <loading v-show="hasMore" title=""/>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"/>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '../../base/scroll/scroll'
import { search } from '../../api/search'
import { ERR_OK } from '../../api/config'
import { createSong } from '../../common/js/song'
import Loading from '../../base/loading/loading'
import Singer from '../../common/js/singer'
import NoResult from '../../base/no-result/no-result'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      result: [],
      page: 1,
      pullup: true,
      hasMore: true,
      beforeScroll: true
    }
  },
  watch: {
    query() {
      this._search()
    }
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh()
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    listScroll() {
      this.$emit('listScroll')
    },
    searchMore() {
      // 上拉刷新
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        let resData = res.substring(9, res.length - 1).toString()
        resData = JSON.parse(resData)
        if (resData.code === ERR_OK) {
          if (resData.data) {
            this.result = this.result.concat(this._genResult(resData.data))
            this._checkMore(resData.data)
          }
        }
      })
    },
    _search() {
      this.page = 1
      this.hasMore = true
      // 当query变化时，需要从新计算
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        let resData = res.substring(9, res.length - 1).toString()
        resData = JSON.parse(resData)
        if (resData.code === ERR_OK) {
          if (resData.data) {
            this.result = this._genResult(resData.data)
            this._checkMore(resData.data)
          }
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * PERPAGE) > song.totalnum) {
        this.hasMore = false
      }
    },
    getIconClass(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({
          ...data.zhida,
          ...{ type: TYPE_SINGER } // 使用type用来记录歌曲或歌手标识
        })
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      const ret = []
      list.forEach((item) => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item, ''))
        }
      })
      return ret
    },

    ...mapMutations({
      setSinger: 'SET_SINGER'
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

.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    padding: 0 30px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
    .icon
      flex: 0 0 30px
      width: 30px
      [class^="icon-"]
        font-size: 14px
        color: $color-text-d
    .name
      flex: 1
      font-size: $font-size-medium
      color: $color-text-d
      overflow: hidden
      .text
        no-wrap()
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
