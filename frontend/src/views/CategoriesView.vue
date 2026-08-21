<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">
        <span>📁</span>
        Danh sách danh mục
      </h1>
      <span class="page-count">{{ pagination.total }} danh mục</span>
    </div>

    <div class="card">
      <form @submit.prevent="handleCreate" class="create-form" novalidate>
        <input
          v-model="newCategoryName"
          placeholder="Nhập tên danh mục mới..."
          class="form-input"
        />
        <button
          type="submit"
          :disabled="loading || !newCategoryName.trim()"
          class="btn btn-primary"
        >
          <span>➕</span>
          Thêm
        </button>
      </form>
    </div>

    <div v-if="loading && categories.length === 0" class="empty-state">
      <div class="loading-spinner"></div>
      <p>Đang tải danh mục...</p>
    </div>

    <div v-else-if="categories.length === 0" class="empty-state">
      <span class="empty-icon">📂</span>
      <p>Chưa có danh mục nào</p>
      <p class="empty-hint">Hãy thêm danh mục mới bên trên!</p>
    </div>

    <ul v-else class="item-list">
      <li v-for="category in categories" :key="category.id" class="item-card">
        <template v-if="editingId === category.id">
          <input
            v-model="editName"
            @keyup.enter="handleUpdate(category.id)"
            class="form-input"
          />
          <button
            @click="handleUpdate(category.id)"
            :disabled="loading || !editName.trim()"
            class="btn btn-primary btn-sm"
          >
            Lưu
          </button>
          <button
            @click="cancelEdit"
            :disabled="loading"
            class="btn btn-secondary btn-sm"
          >
            Hủy
          </button>
        </template>

        <template v-else>
          <div class="item-info">
            <span class="item-icon">📂</span>
            <span class="item-name">{{ category.name }}</span>
          </div>
          <div class="item-actions">
            <button
              @click="startEdit(category)"
              :disabled="loading"
              class="btn-icon btn-icon-warning"
              title="Sửa"
            >
              ✏️
            </button>
            <button
              @click="handleDelete(category.id)"
              :disabled="loading"
              class="btn-icon btn-icon-danger"
              title="Xóa"
            >
              🗑️
            </button>
          </div>
        </template>
      </li>
    </ul>

    <div v-if="error" class="alert alert-error">
      <span>⚠️</span>
      {{ error }}
    </div>

    <div v-if="pagination.last_page > 1" class="pagination">
      <button
        @click="changePage(pagination.current_page - 1)"
        :disabled="loading || pagination.current_page <= 1"
        class="btn btn-secondary btn-sm"
      >
        ‹ Trước
      </button>

      <span class="pagination-info">
        Trang {{ pagination.current_page }} / {{ pagination.last_page }}
      </span>

      <button
        @click="changePage(pagination.current_page + 1)"
        :disabled="loading || pagination.current_page >= pagination.last_page"
        class="btn btn-secondary btn-sm"
      >
        Sau ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const categories = computed(() => store.state.categories.categories)
const loading = computed(() => store.state.categories.loading)
const error = computed(() => store.state.categories.error)
const pagination = computed(() => store.state.categories.pagination)

const newCategoryName = ref('')
const editingId = ref(null)
const editName = ref('')

onMounted(() => {
  store.dispatch('categories/fetchCategories')
})

const changePage = async (page) => {
  await store.dispatch('categories/fetchCategories', page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleCreate = async () => {
  if (!newCategoryName.value.trim()) return
  try {
    await store.dispatch('categories/createCategory', newCategoryName.value.trim())
    newCategoryName.value = ''
  } catch {
  }
}

const startEdit = (category) => {
  if (loading.value) return
  editingId.value = category.id
  editName.value = category.name
}

const cancelEdit = () => {
  if (loading.value) return
  editingId.value = null
  editName.value = ''
}

const handleUpdate = async (id) => {
  if (!editName.value.trim()) return
  try {
    await store.dispatch('categories/updateCategory', { id, name: editName.value.trim() })
    editingId.value = null
    editName.value = ''
  } catch {
  }
}

const handleDelete = async (id) => {
  if (loading.value) return
  if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return
  try {
    await store.dispatch('categories/deleteCategory', id)
  } catch {
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 22px;
  font-weight: 700;
  color: var(--gray-800);
}

.page-count {
  background: var(--primary-light);
  color: var(--primary);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
}

.create-form {
  display: flex;
  gap: var(--space-sm);
}

.create-form .form-input {
  flex: 1;
}

.form-input {
  padding: 10px 14px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 15px;
  transition: border-color 0.15s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: 10px 18px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-secondary {
  background: var(--gray-200);
  color: var(--gray-700);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--gray-300);
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  list-style: none;
}

.item-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s ease;
}

.item-card:hover {
  box-shadow: var(--shadow-md);
}

.item-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.item-icon {
  font-size: 20px;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--gray-800);
}

.item-actions {
  display: flex;
  gap: var(--space-xs);
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s ease;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon-warning {
  background: var(--warning-light);
  color: var(--warning);
}

.btn-icon-warning:hover:not(:disabled) {
  background: var(--warning);
  color: white;
}

.btn-icon-danger {
  background: var(--danger-light);
  color: var(--danger);
}

.btn-icon-danger:hover:not(:disabled) {
  background: var(--danger);
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  color: var(--gray-500);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--space-sm);
}

.empty-hint {
  font-size: 13px;
  color: var(--gray-400);
  margin-top: var(--space-xs);
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 14px;
}

.alert-error {
  background: var(--danger-light);
  color: var(--danger-hover);
  border: 1px solid var(--danger);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-top: var(--space-md);
}

.pagination-info {
  font-size: 14px;
  color: var(--gray-600);
  font-weight: 500;
}
</style>
