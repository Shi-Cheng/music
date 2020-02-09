// good-storage 对local-storage 和 session-storage的分装
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

// 插入数据，把每次新搜索的数据插入到列表前面，如果列表中已经存在就
// 删除当前位置再插入到最前面
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 存在，但是索引为第一个
  if (index === 0) {
    return
  }
  // 存在，在其他位置
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 把搜索的数据插入到最前面
  arr.unshift(val)
  // 保证缓存中的长度
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 删除缓存
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 缓存搜索内容
export function saveSearch(query) {
  // 取出storage数据值
  const searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  // 保存到storage中
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 删除缓存数据 单个删除
export function deleteSearch(query) {
  const searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 默认从本地取出缓存数据
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 存储播放歌曲
export function savePlay(song) {
  const songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    if (item.id) {
      return song.id === item.id
    }
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

//
export function saveFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

