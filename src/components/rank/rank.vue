<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist" :data="topList">
      <ul>
        <li class="item" @click="selectItem(item)" v-for="(item, index) in topList" :key="index">
          <div class="icon">
            <img v-lazy="item.picUrl" />
          </div>
          <ul class="songlist">
            <li
              class="song"
              v-for="(song, idx) in item.songList"
              :key="idx"
            >{{ idx+1 }}{{song.songname}} - {{song.singername}}</li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  components: { scroll, loading },
  data() {
    return {
      topList: []
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    playlistHandler() {
      const bottom = this.playlist.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.rank
  position: absolute
  width: 100%
  top: 88px
  bottom: 0
  overflow: hidden
  .toplist
    height: 100%
    overflow: hidden
    ul
      padding: 1px 0
      .item
        display: flex
        height: 100px
        margin: 20px 20px
        overflow: hidden
        border-radius: 8px
        .icon
          height: 100px
          width: 100px
          img
            width: 100%
            height: 100%
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>