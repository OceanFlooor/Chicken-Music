<template>
  <transition appear name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import musicList from 'base/musicList/musicList'
import { getSongList } from 'api/recommend'
import { mapGetters } from 'vuex'
import { processSongsUrl, createSong, isValidMusic } from 'common/js/song'

export default {
  components: { musicList },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['disc']),
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    }
  },
  created() {
    this._getSongList(this.disc.dissid)
  },
  methods: {
    _getSongList(disstid) {
      if (!disstid) {
        this.$router.go(-1)
        return
      }
      getSongList(disstid).then(res => {
        if (typeof res === 'string') {
          const reg = /^\w+\(({.+})\)$/
          const matches = res.match(reg)
          if (matches) {
            res = JSON.parse(matches[1])
          }
        }

        processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(
          songs => {
            this.songs = songs
          }
        )
      })
    },
    _normalizeSongs(songs) {
      let ret = []
      songs.map(item => {
        if (isValidMusic(item)) ret.push(createSong(item))
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition: all 0.3s
.slide-enter, .slide-leave-to
  transform: translateX(100%)
</style>