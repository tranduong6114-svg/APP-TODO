import api from '@/plugins/axios'

const categoriesModule = {
  namespaced: true,

  state: () => ({
    categories: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
  }),

  getters: {
    allCategories: (state) => state.categories,
  },

  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    },
    ADD_CATEGORY(state, category) {
      state.categories.unshift(category)
    },
    UPDATE_CATEGORY(state, updatedCategory) {
      const index = state.categories.findIndex((c) => c.id === updatedCategory.id)
      if (index !== -1) {
        state.categories.splice(index, 1, updatedCategory)
      }
    },
    REMOVE_CATEGORY(state, categoryId) {
      state.categories = state.categories.filter((c) => c.id !== categoryId)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination
    },
  },

  actions: {
    async fetchCategories({ commit }, page = 1) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await api.get('/api/categories', { params: { page } })
        const categoriesData = response.data.data || response.data
        const meta = response.data.meta || {}
        const pagination = {
          current_page: meta.current_page || 1,
          last_page: meta.last_page || 1,
          per_page: meta.per_page || 10,
          total: meta.total || categoriesData.length,
        }
        commit('SET_CATEGORIES', categoriesData)
        commit('SET_PAGINATION', pagination)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Không thể tải danh sách danh mục')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createCategory({ commit, state, dispatch }, name) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await api.post('/api/categories', { name })
        const categoryData = response.data.data || response.data
        commit('ADD_CATEGORY', categoryData)
        commit('SET_ERROR', null)

        if (state.pagination.current_page !== 1 && state.categories.length > state.pagination.per_page) {
          await dispatch('fetchCategories', 1)
        }
        return categoryData
      } catch (error) {
        const errors = error.response?.data?.errors
        const firstError = errors ? Object.values(errors).flat()[0] : null
        commit('SET_ERROR', firstError || error.response?.data?.message || 'Tạo danh mục thất bại')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateCategory({ commit }, { id, name }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await api.put(`/api/categories/${id}`, { name })
        const categoryData = response.data.data || response.data
        commit('UPDATE_CATEGORY', categoryData)
        commit('SET_ERROR', null)
        return categoryData
      } catch (error) {
        const errors = error.response?.data?.errors
        const firstError = errors ? Object.values(errors).flat()[0] : null
        commit('SET_ERROR', firstError || error.response?.data?.message || 'Cập nhật danh mục thất bại')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteCategory({ commit, state, dispatch }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await api.delete(`/api/categories/${id}`)
        commit('REMOVE_CATEGORY', id)

        if (state.categories.length < state.pagination.per_page && state.pagination.current_page > 1) {
          await dispatch('fetchCategories', state.pagination.current_page - 1)
        } else if (state.categories.length === 0 && state.pagination.current_page > 1) {
          await dispatch('fetchCategories', state.pagination.current_page - 1)
        } else if (state.categories.length < state.pagination.per_page && state.pagination.last_page > state.pagination.current_page) {
          await dispatch('fetchCategories', state.pagination.current_page)
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Xóa danh mục thất bại')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
}

export default categoriesModule