import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const MusicRecommend = (resolve) => {
  import('../views/recommend/index').then((module) => {
    resolve(module)
  })
}

const RecommendDisc = (resolve) => {
  import('../views/disc/index').then((module) => {
    resolve(module)
  })
}

const MusicSinger = (resolve) => {
  import('../views/singer/index').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('../views/singer-detail/index').then((module) => {
    resolve(module)
  })
}

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
        path: ':id',
        component: RecommendDisc
      }]
    },
    {
      path: '/singer',
      component: MusicSinger,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
