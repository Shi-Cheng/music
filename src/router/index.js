import Vue from 'vue'
import Router from 'vue-router'
import MusicRecommend from '@/views/recommend/index'
import RecommendDisc from '@/views/disc/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: MusicRecommend,
      children: [{
        path: 'id',
        component: RecommendDisc
      }]
    }
  ]
})
