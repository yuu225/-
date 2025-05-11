import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { isPublic: true },
    },
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'teacher',
          name: 'TeacherManagement',
          component: () => import('@/views/TeacherRole.vue'),
        },
        {
          path: 'student',
          name: 'StudentManagement',
          component: () => import('@/views/StudentRole.vue'),
        },
        {
          path: 'score',
          name: 'Score management',
          component: () => import('@/views/ScoreView.vue'),
        },
      ],
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('../views/error/404View.vue'),
      meta: { isPublic: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (to.path === '/') {
    return next('/login')
  }

  if (to.meta.isPublic) {
    if (isAuthenticated && to.path === '/login') {
      return next('/home')
    }
    return next()
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router
