import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

/** 搜索历史数组中插入最新搜索记录
 *
 * @param {Array} arr the array of search history
 * @param {String} val the latest search value
 * @param {Function} compare compare function
 * @param {Number} maxLen max-length
 */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)

  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }

  arr.unshift(val)

  if (arr.length && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])

  insertArray(
    searches,
    query,
    item => {
      return query === item
    },
    SEARCH_MAX_LENGTH
  )

  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  console.log('excecute initial state')
  return storage.get(SEARCH_KEY, [])
}

export function clearStorageSearchHistory() {
  storage.remove(SEARCH_KEY)
}
