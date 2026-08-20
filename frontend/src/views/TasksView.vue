<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">
        <span>📋</span>
        Công việc của tôi
      </h1>
      <span class="page-count">{{ tasks.length }} công việc</span>
    </div>

    <div class="card">
      <form @submit.prevent="handleCreate" class="create-form" novalidate>
        <input
          v-model="newTaskTitle"
          placeholder="Nhập tiêu đề công việc mới..."
          class="form-input"
        />
        <input
          id="new-task-deadline"
          type="datetime-local"
          class="form-input form-input-sm"
          title="Hạn hoàn thành"
        />
        <select v-model="newTaskCategoryId" class="form-input form-input-sm">
          <option :value="null">Không danh mục</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <button
          type="submit"
          :disabled="loading || !newTaskTitle.trim()"
          class="btn btn-primary"
        >
          ➕ Thêm
        </button>
      </form>
    </div>

    <div v-if="loading && tasks.length === 0" class="empty-state">
      <div class="loading-spinner"></div>
      <p>Đang tải công việc...</p>
    </div>

    <div v-else-if="tasks.length === 0" class="empty-state">
      <span class="empty-icon">📝</span>
      <p>Chưa có công việc nào</p>
      <p class="empty-hint">Hãy thêm công việc mới bên trên!</p>
    </div>

    <ul v-else class="item-list">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="task-card"
        :class="{ 'task-completed': task.is_completed }"
      >
        <template v-if="editingId === task.id">
          <div class="task-edit-form">
            <input
              v-model="editTitle"
              @keyup.enter="handleUpdate(task.id)"
              class="form-input"
              placeholder="Tiêu đề công việc"
            />
            <input
              v-model="editDeadline"
              type="datetime-local"
              class="form-input form-input-sm"
            />
            <select
              v-model="editCategoryId"
              class="form-input form-input-sm"
            >
              <option :value="null">Không danh mục</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="task-actions">
            <button
              @click="handleUpdate(task.id)"
              :disabled="loading || !editTitle.trim()"
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
          </div>
        </template>

        <template v-else>
          <div class="task-info">
            <div class="task-main">
              <span class="task-title" :class="{ done: task.is_completed }">
                {{ task.title }}
              </span>
              <span v-if="task.category" class="task-category">
                📂 {{ task.category.name }}
              </span>
            </div>
            <div class="task-meta">
              <span v-if="task.deadline" class="task-deadline">
                ⏰ {{ formatDeadline(task.deadline) }}
              </span>
              <span class="task-time">
                🕐 {{ formatDate(task.created_at) }}
              </span>
            </div>
          </div>

          <div class="task-actions">
            <button
              v-if="!task.is_completed"
              @click="toggleComplete(task)"
              :disabled="loading"
              class="btn-icon btn-icon-success"
              title="Hoàn thành"
            >
              ✓
            </button>
            <span v-else class="task-done-badge">
              ✅ Đã xong
            </span>

            <button
              v-if="!task.is_completed"
              @click="startEdit(task)"
              :disabled="loading"
              class="btn-icon btn-icon-warning"
              title="Sửa"
            >
              ✏️
            </button>

            <button
              @click="handleDelete(task.id)"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const tasks = computed(() => store.state.tasks.tasks)
const categories = computed(() => store.state.categories.categories)
const loading = computed(() => store.state.tasks.loading)
const error = computed(() => store.state.tasks.error)

const newTaskTitle = ref('')
const newTaskCategoryId = ref(null)

const editingId = ref(null)
const editTitle = ref('')
const editCategoryId = ref(null)
const editDeadline = ref('')

onMounted(async () => {
  await Promise.all([
    store.dispatch('tasks/fetchTasks'),
    store.dispatch('categories/fetchCategories'),
  ])
})

const handleCreate = async () => {
  if (!newTaskTitle.value.trim()) return

  const deadlineInput = document.getElementById('new-task-deadline')
  const deadlineValue = deadlineInput?.value || ''

  try {
    await store.dispatch('tasks/createTask', {
      title: newTaskTitle.value.trim(),
      category_id: newTaskCategoryId.value,
      deadline: deadlineValue,
    })
    await store.dispatch('tasks/fetchTasks')

    newTaskTitle.value = ''
    newTaskCategoryId.value = null
    if (deadlineInput) deadlineInput.value = ''
    cancelEdit()
  } catch {
  }
}

const startEdit = (task) => {
  if (loading.value) return
  editingId.value = task.id
  editTitle.value = task.title
  editCategoryId.value = task.category_id
  editDeadline.value = task.deadline ? formatDateTimeLocal(task.deadline) : ''
}

const cancelEdit = () => {
  if (loading.value) return
  editingId.value = null
  editTitle.value = ''
  editCategoryId.value = null
  editDeadline.value = ''
}

const handleUpdate = async (id) => {
  if (!editTitle.value.trim()) return

  try {
    await store.dispatch('tasks/updateTask', {
      id,
      title: editTitle.value.trim(),
      category_id: editCategoryId.value,
      deadline: editDeadline.value,
    })
    await store.dispatch('tasks/fetchTasks')
    cancelEdit()
  } catch {
  }
}

const toggleComplete = async (task) => {
  if (loading.value) return
  try {
    await store.dispatch('tasks/updateTask', {
      id: task.id,
      title: task.title,
      category_id: task.category_id,
      is_completed: true,
    })
  } catch {
  }
}

const handleDelete = async (id) => {
  if (loading.value) return
  if (!confirm('Bạn có chắc muốn xóa công việc này?')) return
  try {
    await store.dispatch('tasks/deleteTask', id)
  } catch {
  }
}

const formatDeadline = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const dateStr = `${day}/${month}/${year}`
  const timeStr = `${hours}:${minutes}`
  const fullStr = `${dateStr} ${timeStr}`

  const now = new Date()
  const diff = date - now

  if (diff < 0) {
    return `Quá hạn (${fullStr})`
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `Còn ${minutes} phút`
    }
    return `Còn ${hours} giờ`
  }
  if (days === 1) return `Ngày mai ${timeStr}`
  if (days < 7) return `${days} ngày nữa (${fullStr})`
  return fullStr
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const formatDateTimeLocal = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
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
  flex-wrap: wrap;
}

.create-form .form-input:first-child {
  flex: 2;
  min-width: 200px;
}

.form-input {
  padding: 10px 14px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 15px;
  background: var(--bg-card);
  transition: border-color 0.15s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
}

.form-input-sm {
  flex: 1;
  min-width: 140px;
  padding: 10px 12px;
  font-size: 14px;
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

.task-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--primary);
  transition: all 0.15s ease;
  gap: var(--space-md);
}

.task-card:hover {
  box-shadow: var(--shadow-md);
}

.task-card.task-completed {
  border-left-color: var(--success);
  background: var(--success-light);
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.task-main {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.task-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--gray-800);
}

.task-title.done {
  text-decoration: line-through;
  color: var(--gray-400);
}

.task-category {
  background: var(--primary-light);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: 12px;
  color: var(--gray-500);
}

.task-deadline {
  color: var(--warning);
  font-weight: 500;
}

.task-completed .task-deadline {
  color: var(--gray-400);
}

.task-actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.task-done-badge {
  font-size: 13px;
  color: var(--success);
  font-weight: 600;
  padding: 4px 8px;
}

.task-edit-form {
  flex: 1;
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.task-edit-form .form-input:first-child {
  flex: 2;
  min-width: 200px;
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

.btn-icon-success {
  background: var(--success-light);
  color: var(--success);
}

.btn-icon-success:hover:not(:disabled) {
  background: var(--success);
  color: white;
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
</style>
