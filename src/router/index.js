import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutPage.vue'),
      redirect: '/article/classify',
      children: [
        {
          path: '/article/classify',
          component: () => import('@/views/layout/article/ArticleClassify.vue')
        },
        {
          path: '/article/manage',
          component: () => import('@/views/layout/article/ArticleManage.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/layout/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/layout/user/UserPassword.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/layout/user/UserProfile.vue')
        }
      ]
    }
  ]
})

// 全局前置守卫
router.beforeEach((to) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
