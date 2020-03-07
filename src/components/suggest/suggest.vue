<template>
  <scroll class="suggest" :data="result" :pullUp="pullUp" :beforeScroll="beforeScroll" @beforeScroll="listScroll" @scrollToEnd="searchMore" ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayNTxt(item)"></p>
        </div>
      </li>
      <loading title v-show="hasMore && onPullUp"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { processSongsUrl, createSong, isValidMusic } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapMutations, mapActions } from 'vuex'
import Singer from 'common/js/singer'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  components: {
    Scroll,
    Loading,
    NoResult
  },
  data() {
    return {
      result: [],
      page: 1,
      hasMore: false,
      pullUp: true,
      onPullUp: false,
      beforeScroll: true
    }
  },
  props: {
    query: {
      default: null,
      type: String
    },
    showSinger: {
      default: true,
      type: Boolean
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        return
      }
      this.search()
    }
  },
  methods: {
    search() {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (typeof res === 'string') {
          const data = this.formatJsonp(res).data
          this._checkMore(data)

          this._genResult(data).then(result => {
            this.result = result
          })
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }

      this.onPullUp = true
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        this.onPullUp = false
        if (typeof res === 'string') {
          const data = this.formatJsonp(res).data
          this._checkMore(data)

          this._genResult(data).then(result => {
            if (result[0].type === TYPE_SINGER) {
              result = result.slice(1)
            }
            this.result = this.result.concat(result)
          })
        }
      })
    },
    formatJsonp(str) {
      const reg = /^\w+\(({.+})\)$/
      const matches = str.match(reg)

      return matches ? JSON.parse(matches[1]) : ''
    },
    // 搜索点击跳转处理
    selectItem(item) {
      // 如果点击查询歌手
      if (item.type === TYPE_SINGER) {
        this.$router.push({
          path: `/search/${item.singermid}`
        })
        this.setSinger(
          new Singer({
            id: item.singermid,
            name: item.singername
          })
        )
        // 如果点击播放歌曲
      } else {
        this.insertSong(item)
      }
      // 抛出select事件记录搜索历史
      this.$emit('select')
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }

      return processSongsUrl(this._normalizeSongs(data.song.list)).then(songs => {
        ret = ret.concat(songs)
        return ret
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || song.curnum + (song.curpage - 1) * perpage >= song.totalnum) {
        this.hasMore = false
      }
    },
    _normalizeSongs(list) {
      let ret = []
      list.map(item => {
        if (isValidMusic(item)) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayNTxt(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    listScroll() {
      this.$emit('listScroll')
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
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
      [class^='icon-']
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
