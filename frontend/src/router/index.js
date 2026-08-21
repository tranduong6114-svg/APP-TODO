import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import TasksView from '@/views/TasksView.vue'

const routes = [
  {
    path: '/',
    redirect: '/tasks',
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
    next({ name: 'tasks' })
    return
  }

  next()
})

export default router