import { createStore } from 'vuex'
import authModule from './modules/auth'
import categoriesModule from './modules/categories'
import tasksModule from './modules/tasks'

const store = createStore({
  modules: {
    auth: authModule,
    categories: categoriesModule,
    tasks: tasksModule,
  },
})

export default store