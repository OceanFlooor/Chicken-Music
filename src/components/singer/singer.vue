<template>
  <div class="singer" ref="singer">
    <list-view :data="singerList" @selectItem="selectItem" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  name: 'Singer',
  components: {
    ListView
  },
  mixins: [playlistMixin],
  data() {
    return {
      singerList: []
    }
  },
  mounted() {
    this._initSinger()
  },
  methods: {
    _initSinger() {
      getSingerList().then(res => {
        this.singerList = this._handleList(res.data.list)
      })
      // axios({
      //   methods: 'get',
      //   url: 'static/mock.json'
      // }).then(res => {
      //   this.singerList = this._handleList(res.data.list)
      // })
    },
    _handleList(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.map((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          )
        }

        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        )
      })

      let ret = []
      let hot = []
      for (let k in map) {
        if (k.length === 1 && k.match(/[A-Za-z]/)) ret.push(map[k])
        else if (k === 'hot') hot.push(map[k])
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return [...hot, ...ret]
    },
    selectItem(item) {
      this.$router.push({
        path: `/singer/${item.id}`
      })
      this.setSinger(item)
    },
    playlistHandler(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0px'
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style lang="stylus" scoped>
.singer
  position: absolute
  top: 88px
  bottom: 0
  width: 100%
</style>
