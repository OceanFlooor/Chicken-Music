<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        :class="{'active-dot': index === currentIndex}"
        v-for="(dot, index) in dots"
        :key="dot"
      ></span>
    </div>
  </div>
</template>

<script>
import BScoll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  data() {
    return {
      dots: [],
      currentIndex: 0,
      pageNum: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    interval: {
      type: [Number, String],
      default: 2000
    },
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    setTimeout(() => {
      this._initSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) this._play()
    }, 20)

    window.addEventListener('resize', () => {
      this._initSliderWidth(true)
    })
  },
  methods: {
    _initSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children

      this.pageNum = this.children.length

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'

        width += sliderWidth
      }
      if (this.loop && !isResize) width += 2 * sliderWidth
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScoll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      this.slider.on('scrollEnd', () => {
        this.currentIndex = this.slider.getCurrentPage().pageX

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.slider
  min-height: 1px
  overflow: hidden
  .slider-group
    overflow: hidden
    display: flex
    flex-wrap: nowrap
    div
      display: block
      img
        width: 100%
  .dots
    position: absolute
    bottom: 12px
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    .dot
      display: block
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      margin: 0 4px
      &.active-dot
        background: $color-text-ll
</style>