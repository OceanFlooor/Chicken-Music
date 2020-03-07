import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'
import { saveSearch, clearStorageSearchHistory } from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex(item => {
    return song.id === item.id
  })
}

export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)

  if (state.mode === playMode.random) {
    let randomList = shuffle(list)

    index = findIndex(randomList, list[index])
    list = randomList
  }
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, index)
}

export const randomPlay = function({ commit, state }, list) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYLIST, shuffle(list))
}

export const insertSong = function({ commit, state }, song) {
  let playlist = state.playlist.slice(0)
  let currentIndex = state.currentIndex
  let sequenceList = state.sequenceList.slice(0)
  let currentSong = playlist[currentIndex]

  /**
   * 处理playlist逻辑
   * playlist中song的索引
   */
  let fpIndex = findIndex(playlist, song)
  currentIndex++
  // 如果playlist存在插入的song,则删掉后再插入
  if (fpIndex > -1) {
    // 删除
    playlist.splice(fpIndex, 1)
    // 如果当前插入的序号大于列表中的序号,插入索引-1
    if (currentIndex > fpIndex) {
      currentIndex--
    }
  }
  // 插入歌曲
  playlist.splice(currentIndex, 0, song)

  /**
   * 处理sequenceList逻辑
   * sequenceList中插入的索引
   * sequenceList中song的索引
   */
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)

  if (fsIndex > -1) {
    // 删除
    sequenceList.splice(fsIndex, 1)
    // 如果当前插入的序号大于列表中的序号,插入索引-1
    if (currentSIndex > fsIndex) {
      currentSIndex--
    }
  }
  sequenceList.splice(currentSIndex, 0, song)

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
}

export const saveSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const clearSearchHistory = function({ commit }) {
  clearStorageSearchHistory()
  commit(types.DELETE_SEARCH_HISTORY)
}
