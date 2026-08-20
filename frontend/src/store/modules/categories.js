import api from '@/plugins/axios'

const categoriesModule = {
  namespaced: true,

  state: () => ({
    categories: [],
    loading: false,
    error: null,
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
  },

  actions: {
    async fetchCategories({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await api.get('/api/categories')
        const categoriesData = response.data.data || response.data
        commit('SET_CATEGORIES', categoriesData)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Không thể tải danh sách danh mục')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createCategory({ commit }, name) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await api.post('/api/categories', { name })
        const categoryData = response.data.data || response.data
        commit('ADD_CATEGORY', categoryData)
        commit('SET_ERROR', null)
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

    async deleteCategory({ commit }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await api.delete(`/api/categories/${id}`)
        commit('REMOVE_CATEGORY', id)
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