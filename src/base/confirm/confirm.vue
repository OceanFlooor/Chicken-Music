<template>
  <transition appear name="confirm-fade">
    <div class="popup-wrapper" v-show="showFlag" @click.stop>
      <div class="content">
        <div class="popup">
          <div class="popup-top">{{ message }}</div>
          <div class="popup-bottom">
            <span @click="close">{{ leftButton }}</span>
            <span class="heightlight" @click="confirm">{{ rightButton }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '是否确认操作'
    },
    leftButton: {
      type: String,
      default: '取消'
    },
    rightButton: {
      type: String,
      default: '确定'
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    open() {
      this.showFlag = true
    },
    close() {
      this.showFlag = false
    },
    confirm() {
      this.$emit('confirm')
      this.close()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.popup-wrapper
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  z-index: 998
  background-color: $color-background-d
  .content
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    z-index: 999
    .popup
      text-align: center
      width: 270px
      border-radius: 13px
      background: $color-highlight-background
      .popup-top
        font-size: $font-size-large
        color: $color-text-l
        padding: 19px 15px
      .popup-bottom
        font-size: $font-size-large
        display: flex
        align-items: center
        span
          flex: 1
          line-height: 22px
          padding: 10px 0
          border-top: 1px solid $color-background-d
          color: $color-text-d
          &.heightlight
            color: $color-theme
            border-left: 1px solid $color-background-d
  /*
    css中，当一个元素同时使用了transform设置了定位，和animation动画，则在animation生效的过程中，transform会失效
    例如：
      .animation-div
        animation: someAnimate ...
        transform: translate(50%, 50%)  // 在animation生效的过程中，transform会失效

    修改：在animation-div外层套一层div-wrapper，利用div-wrapper设置transform来定位
      .div-wrapper
        transform: translate(50%, 50%)  // 把transform放在外层div
        .animation-div
          animation: someAnimate ...
    */
  &.confirm-fade-enter-active
    animation: confirm-fadein 0.3s
    .popup
      animation: confirm-zoomin 0.3s
  &.confirm-fade-leave-active
    animation: confirm-fadeout 0.3s
    .popup
      animation: confirm-zoomout 0.3s
@keyframes confirm-fadein
  0%
    opacity: 0
  100%
    opacity: 1
@keyframes confirm-fadeout
  0%
    opacity: 1
  100%
    opacity: 0
@keyframes confirm-zoomin
  0%
    transform: scale(0)
  100%
    transform: scale(1)
@keyframes confirm-zoomout
  0%
    transform: scale(1)
  100%
    transform: scale(0)
</style>
