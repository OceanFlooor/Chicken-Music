<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="top">
          <i class="icon-back" @click="back"></i>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>

        <div
          class="middle"
          @touchstart.prevent="middleTouchstart"
          @touchmove.prevent="middleTouchmove"
          @touchend="middleTouchend"
        >
          <div class="album" ref="middleL">
            <div class="cd-wrapper">
              <img :src="currentSong.image" :class="cdCls" alt />
            </div>
            <p class="playingLyric">{{ playingLyric }}</p>
          </div>

          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                >{{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent="percent"
                @progressChange="progressChange"
                @progressMove="progressMove"
              ></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i></i>
<!--              <i class="icon-not-favorite"></i>-->
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper" ref="miniWrapper">
            <img ref="miniImage" :class="cdCls" width="40" height="40" :src="currentSong.image" />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i :class="playIconMini" class="icon-mini" @click.stop="togglePlay"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <audio ref="player" @canplay="ready" @timeupdate="updateTime" @ended="songEnded"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import progressBar from 'base/progress-bar/progressBar'
import progressCircle from 'base/progress-circle/progressCircle'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'
import scroll from 'base/scroll/scroll'
import { prefixStyle } from 'common/js/dom'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  name: 'player',
  components: {
    progressBar,
    progressCircle,
    scroll
  },
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    ...mapGetters(['fullScreen', 'playlist', 'currentIndex', 'playing', 'mode', 'sequenceList']),
    currentSong() {
      return this.playlist[this.currentIndex] ? this.playlist[this.currentIndex] : {}
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    playIconMini() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (oldSong && newSong.id === oldSong.id) {
        // 如果播放歌曲没变
        return
      }

      this.currentLyric && this.currentLyric.stop()

      this.$nextTick(() => {
        this.getLyric()
        const player = this.$refs.player
        player.src = newSong.url
        player.play()
      })
    },
    playing(newVal) {
      this.$nextTick(() => {
        const player = this.$refs.player
        newVal ? player.play() : player.pause()
      })
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }

      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })

      this.setCurrentIndex(index)
    },
    getLyric() {
      this.currentSong.getLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this.lyricHandler)
        // console.log(this.currentLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.currentLineNum = 0
        this.playingLyric = ''
      })
    },
    lyricHandler({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[lineNum - 5], 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    togglePlay() {
      this.setPlayingState(!this.playing)
      this.currentLyric && this.currentLyric.togglePlay()
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    format(interval) {
      interval = interval | 0
      const min = (interval / 60) | 0
      let sec = interval % 60
      sec = sec > 9 ? sec : `0${sec}`
      return `${min}:${sec}`
    },
    middleTouchstart(e) {
      this.touch.initiated = true

      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchmove(e) {
      if (!this.touch.initiated) {
        return
      }

      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 记录开始偏移的位置
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth

        const offsetWidth = Math.min(0, Math.max(left + deltaX, -window.innerWidth))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)

        this.$refs.lyricList.$el.style[transform] = `translateX(${offsetWidth}px)`
        this.$refs.lyricList.$el.style[transitionDuration] = `0s`
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = '0s'
      }
    },
    middleTouchend(e) {
      let offsetWidth, opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent >= 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent <= 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translateX(${offsetWidth}px)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
    },
    prev() {
      if (!this.songReady) {
        return
      }

      if (this.playlist.length === 1) {
        this.loop()
      } else {
        if (this.currentIndex === 0) {
          this.setCurrentIndex(this.playlist.length - 1)
        } else {
          this.setCurrentIndex(this.currentIndex - 1)
        }
      }

      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    next() {
      if (!this.songReady) {
        return
      }

      if (this.playlist.length === 1) {
        this.loop()
      } else {
        if (this.currentIndex === this.playlist.length - 1) {
          this.setCurrentIndex(0)
        } else {
          this.setCurrentIndex(this.currentIndex + 1)
        }
      }

      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    loop() {
      this.$refs.player.currentTime = 0
      this.$refs.player.play()
      this.currentLyric && this.currentLyric.seek(0)
    },
    ready() {
      this.songReady = true
    },
    songEnded() {
      setTimeout(() => {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      }, 1500)
    },
    progressChange(percent) {
      const currentTime = percent * this.currentSong.duration
      this.$refs.player.currentTime = currentTime

      // 歌词跳转
      this.currentLyric && this.currentLyric.seek(currentTime * 1000)

      this.setPlayingState(true)
    },
    progressMove(percent) {
      this.currentTime = percent * this.currentSong.duration
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'
.player
  .normal-player
    background-color: $color-background
    position: absolute
    z-index: 999
    top: 0
    bottom: 0
    width: 100%
    .top
      margin-bottom: 25px
      .title
        text-align: center
        line-height: 40px
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
      .icon-back
        display: block
        position: absolute
        padding: 9px
        font-size: 22px
        color: $color-theme
        transform: rotate(-90deg)
        left: 6px
    .middle
      position: absolute
      top: 80px
      bottom: 170px
      width: 100%
      white-space: nowrap
      .album
        padding-top: 80%
        height: 0
        position: relative
        display: inline-block
        width: 100%
        .cd-wrapper
          position: absolute
          top: 0
          left: 10%
          width: 80%
          height: 100%
          img
            width: 100%
            border-radius: 50%
            border: 10px solid rgba(255, 255, 255, 0.1)
            box-sizing: border-box
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
        .playingLyric
          text-align: center
          margin: 30px auto 0 auto
          width: 80%
          overflow: hidden
          height: 20px
          line-height: 20px
          font-size: $font-size-medium
          color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
          .pure-music
            padding-top: 50%
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        display: flex
        justify-content: center
        align-items: center
        .dot
          background: $color-text-l
          margin: 0 4px
          width: 8px
          height: 8px
          display: inline-block
          border-radius: 50%
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
    &.normal-enter, &.normal-leave-to
      transform: translate3d(0, 100%, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    .icon
      flex: 0 0 40px
      width: 40px
      height: 40px
      padding: 0 10px 0 20px
      .imgWrapper
        width: 100%
        border-radius: 50%
        overflow: hidden
        img
          &.play
            animation: rotate 20s linear infinite
          &.pause
            animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 32px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 32px
        color: $color-theme-d
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.6s
    &.mini-enter, &.mini-leave-to
      transform: translate3d(-100%, 0, 0)
.icon-mini
  position: absolute
  top: 0
  left: 0
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
