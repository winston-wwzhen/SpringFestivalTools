// 路由配置
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { title: '仪表盘', requiresAuth: true }
      },
      {
        path: 'content/redpack',
        name: 'ContentRedpack',
        component: () => import('@/views/content/redpack/List.vue'),
        meta: { title: '红包管理', requiresAuth: true }
      },
      {
        path: 'content/gala',
        name: 'ContentGala',
        component: () => import('@/views/content/gala/List.vue'),
        meta: { title: '春晚管理', requiresAuth: true }
      },
      {
        path: 'content/gala/program/:platformId/:id',
        name: 'ProgramDetail',
        component: () => import('@/views/content/gala/ProgramDetail.vue'),
        meta: { title: '节目详情', requiresAuth: true }
      },
      {
        path: 'crawler',
        name: 'Crawler',
        component: () => import('@/views/crawler/TaskList.vue'),
        meta: { title: '爬虫管理', requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 初始化认证状态
  if (!authStore.token) {
    authStore.init()
  }

  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !authStore.isAuthenticated()) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated()) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
