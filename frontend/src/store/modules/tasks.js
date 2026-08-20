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
    completedTasks: (state) => state.tasks.filter(t => t.is_completed),
    pendingTasks: (state) => state.tasks.filter(t => !t.is_completed),
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
        commit('SET_ERROR', error.response?.data?.message || 'Không thể tải danh sách công việc')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createTask({ commit }, { title, category_id, deadline }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const payload = { title, category_id }

        if (deadline && deadline.trim() !== '') {
          payload.deadline = deadline
        }

        const response = await api.post('/api/tasks', payload)
        const taskData = response.data.data || response.data
        commit('ADD_TASK', taskData)
        commit('SET_ERROR', null)
        return taskData
      } catch (error) {
        const errors = error.response?.data?.errors
        const firstError = errors ? Object.values(errors).flat()[0] : null
        commit('SET_ERROR', firstError || error.response?.data?.message || 'Tạo công việc thất bại')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateTask({ commit }, { id, title, category_id, is_completed, deadline }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const payload = {}

        if (title !== undefined) payload.title = title
        if (category_id !== undefined) payload.category_id = category_id
        if (typeof is_completed === 'boolean') payload.is_completed = is_completed
        if (deadline !== undefined) {
          payload.deadline = deadline && deadline.trim() !== '' ? deadline : null
        }

        const response = await api.put(`/api/tasks/${id}`, payload)
        const taskData = response.data.data || response.data
        commit('UPDATE_TASK', taskData)
        commit('SET_ERROR', null)
        return taskData
      } catch (error) {
        const errors = error.response?.data?.errors
        const firstError = errors ? Object.values(errors).flat()[0] : null
        commit('SET_ERROR', firstError || error.response?.data?.message || 'Cập nhật công việc thất bại')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteTask({ commit }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await api.delete(`/api/tasks/${id}`)
        commit('REMOVE_TASK', id)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Xóa công việc thất bại')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async bulkComplete({ commit, state }, taskIds) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const promises = taskIds.map(id => {
          return api.put(`/api/tasks/${id}`, { is_completed: true })
        })
        const results = await Promise.all(promises)

        taskIds.forEach(id => {
          const updatedTask = results.find((r, index) => taskIds[index] === id)?.data?.data
          if (updatedTask) {
            commit('UPDATE_TASK', updatedTask)
          }
        })

        return true
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Cập nhật hàng loạt thất bại')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async bulkDelete({ commit }, taskIds) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const promises = taskIds.map(id => api.delete(`/api/tasks/${id}`))
        await Promise.all(promises)

        taskIds.forEach(id => {
          commit('REMOVE_TASK', id)
        })

        return true
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Xóa hàng loạt thất bại')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
}

export default tasksModule
