import { mapGetters } from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() {
    this.playlistHandler(this.playlist)
  },
  activated() {
    this.playlistHandler(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.playlistHandler(newVal)
    }
  },
  methods: {
    playlistHandler() {
      throw new Error('playlistHandler method must be implemented in component')
    }
  }
}
