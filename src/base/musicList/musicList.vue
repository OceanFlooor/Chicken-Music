<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>

    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="random-play" @click="randomPlayAll" ref="randomPlay" v-if="songs.length > 0">
        <i class="icon-play"></i>
        <span>随机播放全部</span>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>

    <scroll
      :data="songs"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      @scroll="scroll"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectSong" :rank="rank"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import songList from 'base/songList/songList'
import Scroll from 'base/scroll/scroll'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'

const RESERVE_HEIGHT = 40
const transform = prefixStyle('transform')

export default {
  name: 'musicList',
  components: {
    songList,
    Scroll
  },
  data() {
    return {
      scrollY: 0
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVE_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(newY, this.minTranslateY)
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`

      let scale = 1
      let zIndex = 0
      if (newY > 0) {
        scale = 1 + Math.abs(newY / this.imageHeight)
        zIndex = 10
      }

      if (newY < this.minTranslateY) {
        // 上滑至列表最小偏移量
        this.$refs.randomPlay.style.display = 'none'

        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVE_HEIGHT}px`
      } else {
        this.$refs.randomPlay.style.display = 'flex'

        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectSong(song, index) {
      this.selectPlay({ list: this.songs, index })
    },
    randomPlayAll() {
      this.randomPlay(this.songs)
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.music-list
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  background-color: $color-background
  z-index: 100
  .back
    position: absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    background-size: cover
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    .random-play
      width: 135px
      position: absolute
      bottom: 20px
      left: 50%
      transform: translateX(-50%)
      padding: 7px 0
      color: $color-theme
      border-radius: 17px
      border: 1px solid $color-theme
      display: flex
      align-items: center
      justify-content: center
      span
        font-size: $font-size-small
        margin: 0 5px
  .list
    position: absolute
    bottom: 0
    top: 0
    width: 100%
    background: $color-background
  .bg-layer
    height: 100%
    background: $color-background
</style>