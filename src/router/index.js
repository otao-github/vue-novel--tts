import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      name: '主页'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About'),
    meta: {
      name: '关于'
    }
  },
  {
    path: '/novel/:novelId',
    name: 'Novel',
    component: () => import('@/views/Novel'),
    meta: {
      name: '目录',
      params: ['novelId']
    }
  },
  {
    path: '/novel/:novelId/chapter/:chapterId',
    name: 'NovelChapter',
    component: () => import('@/views/NovelChapter'),
    meta: {
      name: '章节',
      params: ['novelId', 'chapterId']
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
