import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as getters from './getter'
import mutations from './mutations'
import * as actions from './actions'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
