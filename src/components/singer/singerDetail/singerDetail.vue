<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong, processSongsUrl } from 'common/js/song'
import musicList from 'base/musicList/musicList'

export default {
  name: 'singerDetail',
  components: {
    musicList
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['singer']),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created() {
    this._getSinger()
  },
  methods: {
    _getSinger() {
      if (!this.singer.id) {
        this.$router.push({
          path: '/singer'
        })
        return
      }

      getSingerDetail(this.singer.id).then(res => {
        processSongsUrl(this._normalizeSongs(res.data.list)).then(songs => {
          this.songs = songs
        })
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.map(item => {
        let { musicData } = item
        if (musicData.albumname && musicData.songname) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.slide-enter-active, .slide-leave-active
  transition: all 0.3s
.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>