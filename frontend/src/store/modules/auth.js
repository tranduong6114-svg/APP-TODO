import api from '@/plugins/axios'

const authModule = {
  namespaced: true,

  state: () => ({
    user: JSON.parse(localStorage.getItem('auth_user')) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    user: (state) => state.user,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
      if (user) localStorage.setItem('auth_user', JSON.stringify(user))
      else localStorage.removeItem('auth_user')
    },
    CLEAR_USER(state) {
      state.user = null
      localStorage.removeItem('auth_user')
    },
  },

  actions: {
    async login({ commit }, { email, password }) {
      await api.get('/sanctum/csrf-cookie')

      const response = await api.post('/api/login', { email, password })
      commit('SET_USER', response.data)
      return response.data
    },

    async register({ commit }, { name, email, password, password_confirmation }) {
      await api.get('/sanctum/csrf-cookie')

      const response = await api.post('/api/register', {
        name,
        email,
        password,
        password_confirmation,
      })
      commit('SET_USER', response.data)
      return response.data
    },

    async logout({ commit }) {
      await api.post('/api/logout')
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