<template>
  <div class="categories-view">
    <h1>Danh sách danh mục</h1>

    <form @submit.prevent="handleCreate" class="create-form" novalidate>
      <input v-model="newCategoryName" placeholder="Nhập tên danh mục..." />
      <button type="submit" :disabled="loading">Thêm</button>
    </form>

    <ul class="category-list">
      <li v-for="category in categories" :key="category.id">
        <template v-if="editingId === category.id">
          <input v-model="editName" @keyup.enter="handleUpdate(category.id)" />
          <button @click="handleUpdate(category.id)">Lưu</button>
          <button @click="cancelEdit">Hủy</button>
        </template>
        <template v-else>
          <span>{{ category.name }}</span>
          <button @click="startEdit(category)">Sửa</button>
          <button @click="handleDelete(category.id)">Xóa</button>
        </template>
      </li>
    </ul>

    <p v-if="categories.length === 0 && !loading" class="empty">
      Chưa có danh mục nào. Hãy thêm danh mục mới!
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

const categories = computed(() => store.state.categories.categories)
const loading = computed(() => store.state.categories.loading)
const error = computed(() => store.state.categories.error)

const newCategoryName = ref('')
const editingId = ref(null)
const editName = ref('')

onMounted(() => {
  store.dispatch('categories/fetchCategories')
})

const handleCreate = async () => {
  try {
    await store.dispatch('categories/createCategory', newCategoryName.value)
    newCategoryName.value = ''
  } catch {
  }
}

const startEdit = (category) => {
  editingId.value = category.id
  editName.value = category.name
}

const cancelEdit = () => {
  editingId.value = null
  editName.value = ''
}

const handleUpdate = async (id) => {
  try {
    await store.dispatch('categories/updateCategory', { id, name: editName.value })
    editingId.value = null
    editName.value = ''
  } catch {
  }
}

const handleDelete = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return
  try {
    await store.dispatch('categories/deleteCategory', id)
  } catch {
  }
}
</script>

<style scoped>
.categories-view {
  padding: 20px;
}
.create-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.create-form input {
  padding: 8px;
  flex: 1;
}
.create-form button {
  padding: 8px 16px;
}
.category-list {
  list-style: none;
  padding: 0;
}
.category-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.category-list li span {
  flex: 1;
}
.category-list li input {
  padding: 6px;
  flex: 1;
}
.category-list li button {
  padding: 6px 12px;
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
