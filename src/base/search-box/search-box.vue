<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder" />
    <i class="icon-dismiss" v-show="!!query" @click="dismiss"></i>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'

export default {
  data() {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  created() {
    this.$watch(
      'query',
      /**
       * 函数作为参数传值，后面加个括号则为立即执行该函数后，返回结果作为参数传值
       * 例如：
       * function func1(cb) {
       *   console.log('func1')
       * }
       * function func2(arg1, arg2) {
       *   console.log('func2')
       *   return function() {
       *     console.log('func3')
       *   }
       * }
       * func1(func2(arg1, arg2))
       * 打印结果： func2  func1
       */
      debounce(newQuery => {
        this.$emit('query', newQuery)
      }, 1000)
    )
  },
  methods: {
    dismiss() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.query.blur()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.search-box
  height: 40px
  background: $color-highlight-background
  border-radius: 6px
  display: flex
  justify-content: center
  align-items: center
  padding: 0 6px
  width: 100%
  box-sizing: border-box
  .icon-search
    font-size: 24px
    color: $color-background
  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    outline: 0
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 16px
    color: $color-background
</style>