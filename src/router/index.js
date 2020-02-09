import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const MusicRecommend = (resolve) => {
  import('../views/recommend/index').then((module) => {
    resolve(module)
  })
}

const RecommendDisc = (resolve) => {
  import('../views/disc/disc').then((module) => {
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

const MusicRank = (resolve) => {
  import('../views/rank/index').then((module) => {
    resolve(module)
  })
}

const TopList = (resolve) => {
  import('../views/top-list/top-list').then((module) => {
    resolve(module)
  })
}

const MusicSearch = (resolve) => {
  import('../views/search/search').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('../views/user-center/user-center').then((module) => {
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
    },
    {
      path: '/rank',
      component: MusicRank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: MusicSearch,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
