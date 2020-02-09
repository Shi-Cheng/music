// 组件共用数据、方法部分
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '../../common/js/config'
import { shuffle } from '../../common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

// 相关共享模式切换逻辑
export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        // 随机播放，对播放列表进行重新洗牌
        list = shuffle(this.sequenceList)
      } else {
        // 顺序播放和循环播放
        list = this.sequenceList
      }

      this._resetCurrentIndex(list)
      // 当list改变时，需要重新设置当前播放歌曲的索引
      this.setPlaylist(list)
    },
    _resetCurrentIndex(list) {
      const index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        if (item && song) {
          return item.id === song.id
        }
      })
      return index > -1
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

// 搜索相关的共用模块
export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
