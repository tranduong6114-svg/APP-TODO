<template>
  <div class="tasks-view">
    <h1>Danh sách công việc</h1>

    <form @submit.prevent="handleCreate" class="create-form" novalidate>
      <input v-model="newTaskTitle" placeholder="Nhập tiêu đề công việc..." />
      <select v-model="newTaskCategoryId">
        <option :value="null">Không có danh mục</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <button type="submit" :disabled="loading">Thêm</button>
    </form>

    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id">
        <template v-if="editingId === task.id">
          <input v-model="editTitle" @keyup.enter="handleUpdate(task.id)" />
          <select v-model="editCategoryId">
            <option :value="null">Không có danh mục</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <button @click="handleUpdate(task.id)">Lưu</button>
          <button @click="cancelEdit">Hủy</button>
        </template>
        <template v-else>
          <span :class="{ done: task.is_completed }">{{ task.title }}</span>
          <span class="category-tag" v-if="task.category">{{ task.category.name }}</span>
          <button @click="toggleComplete(task)">
            {{ task.is_completed ? 'Hoàn thành' : 'Đánh dấu xong' }}
          </button>
          <button @click="startEdit(task)">Sửa</button>
          <button @click="handleDelete(task.id)">Xóa</button>
        </template>
      </li>
    </ul>

    <p v-if="tasks.length === 0 && !loading" class="empty">
      Chưa có công việc nào. Hãy thêm công việc mới!
    </p>

    <div v-if="error" class="error-box">
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

onMounted(async () => {
  await Promise.all([
    store.dispatch('tasks/fetchTasks'),
    store.dispatch('categories/fetchCategories'),
  ])
})

const handleCreate = async () => {
  try {
    await store.dispatch('tasks/createTask', {
      title: newTaskTitle.value,
      category_id: newTaskCategoryId.value,
    })
    newTaskTitle.value = ''
    newTaskCategoryId.value = null
  } catch {
  }
}

const startEdit = (task) => {
  editingId.value = task.id
  editTitle.value = task.title
  editCategoryId.value = task.category_id
}

const cancelEdit = () => {
  editingId.value = null
  editTitle.value = ''
  editCategoryId.value = null
}

const handleUpdate = async (id) => {
  try {
    await store.dispatch('tasks/updateTask', {
      id,
      title: editTitle.value,
      category_id: editCategoryId.value,
    })
    editingId.value = null
    editTitle.value = ''
    editCategoryId.value = null
  } catch {
  }
}

const toggleComplete = async (task) => {
  try {
    await store.dispatch('tasks/updateTask', {
      id: task.id,
      title: task.title,
      category_id: task.category_id,
      is_completed: !task.is_completed,
    })
  } catch {
  }
}

const handleDelete = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa công việc này?')) return
  try {
    await store.dispatch('tasks/deleteTask', id)
  } catch {
  }
}
</script>

<style scoped>
.tasks-view {
  padding: 20px;
}
.create-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.create-form input {
  padding: 8px;
  flex: 2;
}
.create-form select {
  padding: 8px;
  flex: 1;
}
.create-form button {
  padding: 8px 16px;
}
.task-list {
  list-style: none;
  padding: 0;
}
.task-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.task-list li span {
  flex: 1;
}
.task-list li input {
  padding: 6px;
  flex: 2;
}
.task-list li select {
  padding: 6px;
  flex: 1;
}
.task-list li button {
  padding: 6px 12px;
}
.category-tag {
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.done {
  text-decoration: line-through;
  color: #888;
}
.empty {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
.error-box {
  color: #b00020;
  background: #fde8e8;
  border: 1px solid #f5c2c2;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
}
</style>
