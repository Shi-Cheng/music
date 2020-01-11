import Vue from 'vue'
import Router from 'vue-router'
import MusicRecommend from '@/views/recommend/index'
// import Recommend from 'views/recommend'
Vue.use(Router)

// const Recommend = (resolve) => {
//   import('views/recommend/index').then((module) => {
//     resolve(module)
//   })
// }

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: MusicRecommend
    }
  ]
})
