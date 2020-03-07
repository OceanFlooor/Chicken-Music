<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="(item, index) in hotkey"
              :key="index"
              @click="addQuery(item.k)"
            >{{ item.k }}</li>
          </ul>
        </div>
      </div>
      <div class="shortcut" v-show="searchHistory.length">
        <div class="hot-key">
          <h1 class="title">
            历史搜索
            <i class="icon-clear" @click="callConfirmer"></i>
          </h1>
          <ul>
            <li
              class="item"
              v-for="(item, index) in searchHistory"
              :key="index"
              @click="addQuery(item)"
            >{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query" @listScroll="inputBlur" @select="saveSearch"></suggest>
    </div>
    <confirm @confirm="clearSearch" :message="message" :rightButton="rightButton" ref="confirm"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import Confirm from 'base/confirm/confirm'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    SearchBox,
    Suggest,
    Confirm
  },
  data() {
    return {
      hotkey: [],
      query: '',
      message: '是否清空所有搜索历史',
      rightButton: '清空'
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  created() {
    this._getHotKey()
  },
  methods: {
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange(newQuery) {
      this.query = newQuery
    },
    inputBlur() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    callConfirmer() {
      this.$refs.confirm.open()
    },
    clearSearch() {
      this.clearSearchHistory()
    },
    ...mapActions({
      saveSearchHistory: 'saveSearchHistory',
      clearSearchHistory: 'clearSearchHistory'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.search
  position: absolute
  width: 100%
  top: 88px
  bottom: 0
  overflow: hidden
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    margin: 20px
    .shortcut
      width: 100%
      overflow: hidden
      .hot-key
        .title
          font-size: $font-size-medium
          color: $color-text-l
          position: relative
          i
            position: absolute
            right: 0px
        ul
          padding: 20px 0
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>