import api from '@/plugins/axios'

const tasksModule = {
  namespaced: true,

  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  getters: {
    allTasks: (state) => state.tasks,
  },

  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks
    },
    ADD_TASK(state, task) {
      state.tasks.unshift(task)
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex((t) => t.id === updatedTask.id)
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask)
      }
    },
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter((t) => t.id !== taskId)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
  },

  actions: {
    async fetchTasks({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await api.get('/api/tasks')
        const tasksData = response.data.data || response.data
        commit('SET_TASKS', tasksData)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch tasks')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createTask({ commit }, { title, category_id }) {
      const response = await api.post('/api/tasks', { title, category_id })
      const taskData = response.data.data || response.data
      commit('ADD_TASK', taskData)
      return taskData
    },

    async updateTask({ commit }, { id, title, category_id }) {
      const response = await api.put(`/api/tasks/${id}`, { title, category_id })
      const taskData = response.data.data || response.data
      commit('UPDATE_TASK', taskData)
      return taskData
    },

    async deleteTask({ commit }, id) {
      await api.delete(`/api/tasks/${id}`)
      commit('REMOVE_TASK', id)
    },
  },
}

export default tasksModule