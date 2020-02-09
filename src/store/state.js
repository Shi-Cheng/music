import { playMode } from '../common/js/config'
import { loadSearch, loadPlay, loadFavorite } from '../common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: [],
  searchHistory: loadSearch(), // 默认为本地缓存的数据,
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state
