<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  name: 'progress-bar',
  props: {
    percent: {
      default: 0,
      type: Number
    }
  },
  created() {
    this.touch = {
      initiated: false
    }
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, deltaX + this.touch.left)
      )

      this._offset(offsetWidth)
      this.$emit('progressMove', this._getPercent())
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left

      this._offset(offsetWidth)
      this._triggerPercent()
    },
    setProgressOffset(percent) {
      if (percent >= 0) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = percent * barWidth
        this._offset(offsetWidth)
      }
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translateX(${offsetWidth}px)`
    },
    _triggerPercent() {
      this.$emit('progressChange', this._getPercent())
    },
    _getPercent() {
      return (
        this.$refs.progress.clientWidth /
        (this.$refs.progressBar.clientWidth - progressBtnWidth)
      )
    }
  },
  watch: {
    percent(newVal) {
      !this.touch.initiated && this.setProgressOffset(newVal)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    border-radius: 2px
    .progress
      position: absolute
      height: 100%
      border-radius: 2px
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>