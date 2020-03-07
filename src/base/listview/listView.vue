<template>
  <div class="list-view">
    <scroll
      :data="data"
      :listenScroll="true"
      @scroll="scroll"
      :probe-type="3"
      class="list-scroll"
      ref="scroll"
    >
      <ul>
        <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
          <h2 class="list-group-title">{{ group.title }}</h2>
          <ul>
            <li
              class="list-group-item"
              v-for="(item, idx) in group.items"
              :key="idx"
              @click="selectItem(item)"
            >
              <img class="avatar" v-lazy="item.avatar" />
              <span class="name">{{ item.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>

    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          class="shortcut-item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 16

export default {
  name: 'listview',
  components: { scroll },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: 0
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(item => {
        return item.title.substring(0, 1)
      })
    }
  },
  watch: {
    scrollY(newY) {
      const listHeight = this.height
      if (newY >= 0) {
        this.currentIndex = 0
        return
      }

      const offsetTop = Math.abs(newY)
      if (offsetTop > listHeight[0] && offsetTop < listHeight[listHeight.length - 1]) {
        for (let i = 0; i < listHeight.length - 1; i++) {
          if (offsetTop <= listHeight[i + 1] && offsetTop > listHeight[i]) {
            this.currentIndex = i
            return
          }
        }
      }

      if (offsetTop >= listHeight[listHeight.length - 1]) {
        this.currentIndex = listHeight.length - 1
      }
    }
  },
  created() {
    this.touch = {}
    this.height = []
  },
  mounted() {
    setTimeout(() => {
      this._calculateHeight()
    }, 20)
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      this.touch.y1 = e.touches[0].pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(this.$refs.listGroup[anchorIndex])
    },
    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY
      let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
      this._scrollTo(this.$refs.listGroup[parseInt(this.touch.anchorIndex) + delta])
    },
    _scrollTo(el) {
      this.$refs.scroll.scrollToElement(el, 0)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _calculateHeight() {
      this.$refs.listGroup.map(item => {
        this.height.push(item.offsetTop)
      })
    },
    selectItem(item) {
      this.$emit('selectItem', item)
    },
    refresh() {
      this.$refs.scroll.refresh()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.list-view
  position: relative
  height: 100%
  .list-scroll
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    overflow: hidden
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        padding: 20px 0 0 30px
        display: flex
        align-items: center
        .avatar
          width: 55px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
  .list-shortcut
    position: absolute
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    list-style: none
    .shortcut-item
      padding: 2px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
</style>
