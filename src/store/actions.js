import * as types from './mutation-types'
import { playMode } from '../common/js/config'
import { shuffle } from '../common/js/util'
import { clearSearch, deleteSearch, saveSearch, savePlay, saveFavorite, deleteFavorite } from '../common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.mode)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 修改当前播放列表playList
  // 记录当前播放歌曲
  const currentSong = playlist[currentIndex]
  // 查找当前播放歌曲是不是在播放列表中，并返回索引
  const fIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引加1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fIndex) {
      playlist.splice(fIndex, 1)
      currentIndex--
    } else {
      // playlist 数组长度发生变化，歌曲位置加1，所以需要fIndex + 1
      playlist.splice(fIndex + 1, 1)
    }
  }
  // 修改sequenceList 播放列表,
  // 插入的位置
  const currentsIndex = findIndex(sequenceList, currentSong) + 1
  // 找出播放的歌曲是否在sequenceList列表
  const fsIndex = findIndex(sequenceList, song)
  // 插入歌曲
  sequenceList.splice(currentsIndex, 0, song)
  // 对插入后的sequenceList列表进行长度调整
  if (fsIndex > -1) {
    if (currentsIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  const sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const deleteSongList = function({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function({ commit }, song) {
  commit(types.SET_FAVOTITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({ commit }, song) {
  commit(types.SET_FAVOTITE_LIST, deleteFavorite(song))
}
