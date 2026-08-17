import { createStore } from 'vuex'
import authModule from './modules/auth'

const store = createStore({
  state: () => ({
  }),
  mutations: {
  },
  actions: {
  },
  getters: {
  },
  modules: {
    auth: authModule,
  },
})

export default store