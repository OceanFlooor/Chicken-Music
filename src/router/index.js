import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Singer = () => import('components/singer/singer')
const Recommend = () => import('components/recommend/recommend')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: () => import('components/disc/disc')
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: () => import('components/topList/topList')
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: () => import('components/singer/singerDetail/singerDetail')
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: () => import('components/singer/singerDetail/singerDetail')
        }
      ]
    }
  ]
})
