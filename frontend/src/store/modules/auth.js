import api from '@/plugins/axios'

import axios from 'axios'
const csrfApi = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
})

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const authModule = {
  namespaced: true,

  state: () => ({
    user: getInitialUser(),
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.user.id,
    user: (state) => state.user,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
      if (user && user.id) {
        localStorage.setItem('auth_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('auth_user')
      }
    },
    CLEAR_USER(state) {
      state.user = null
      localStorage.removeItem('auth_user')
    },
  },

  actions: {
    async login({ commit }, { email, password }) {
      await csrfApi.get('/sanctum/csrf-cookie')

      const response = await api.post('/login', { email, password })
      const userData = response.data

      commit('SET_USER', userData)
      return userData
    },

    async register({ commit }, { name, email, password, password_confirmation }) {
      await csrfApi.get('/sanctum/csrf-cookie')

      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation,
      })
      const userData = response.data

      commit('SET_USER', userData)
      return userData
    },

    async logout({ commit }) {
      try {
        await api.post('/logout')
      } catch {
      }
      commit('CLEAR_USER')
    },

    async fetchUser({ commit }) {
      try {
        const response = await api.get('/api/user')
        commit('SET_USER', response.data)
      } catch {
        commit('CLEAR_USER')
      }
    },
  },
}

export default authModule