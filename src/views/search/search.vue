<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"/>
    </div>
    <div v-show="!query" ref="shortcutWrapper" class="shortcut-wrapper">
      <scroll ref="shortcutScroll" :refresh-delay="refreshDelay" :data="shortcut" class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="(item, index) in hotKey" :key="index" class="item" @click="addQuery(item.k)">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div v-show="searchHistory.length" class="search-history">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"/>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"/>
          </div>
        </div>
      </scroll>
    </div>
    <div v-show="query" ref="searchResultWrapper" class="search-result">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"/>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirm-btn-text="清空" @confirm="clearSearchHistory"/>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '../../base/search-box/search-box'
import SearchList from '../../base/search-list/search-list'
import Confirm from '../../base/confirm/confirm'
import Scroll from '../../base/scroll/scroll'
import Suggest from '../suggest/suggest'
import { getHotKey } from '../../api/search'
import { ERR_OK } from '../../api/config'
import { mapActions } from 'vuex'
import { playlistMixin, searchMixin } from '../../common/js/mixin'

export default {
  components: {
    SearchBox,
    Scroll,
    Suggest,
    SearchList,
    Confirm
  },
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKey: [],
      refreshDelay: 200
    }
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  watch: {
    // 当搜索缓存有变化时，需要重新计算高度
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcutScroll.refresh()
        }, 20)
      }
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    handlePlaylist(playlist) {
      // 当有播放列表时需要重新计算高度
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcutScroll.refresh()
      this.$refs.searchResultWrapper.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          // 截取到前10个数据
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },

    ...mapActions([
      'clearSearchHistory'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
