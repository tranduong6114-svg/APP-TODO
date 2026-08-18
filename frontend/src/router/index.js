import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import TasksView from '@/views/TasksView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isAuthenticated = store.getters['auth/isAuthenticated']
    if (!isAuthenticated) {
      await store.dispatch('auth/fetchUser')
    }
  }

  const nowAuthenticated = store.getters['auth/isAuthenticated']

  if (to.matched.some((record) => record.meta.requiresAuth) && !nowAuthenticated) {
    next({ name: 'login' })
    return
  }

  if (to.matched.some((record) => record.meta.requiresGuest) && nowAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
