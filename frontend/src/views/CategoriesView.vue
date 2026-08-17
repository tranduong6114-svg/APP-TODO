<template>
  <div class="categories-view">
    <h1>Categories</h1>

    <form @submit.prevent="handleCreate" class="create-form">
      <input v-model="newCategoryName" placeholder="Category name" required />
      <button type="submit" :disabled="loading">Add</button>
    </form>

    <ul class="category-list">
      <li v-for="category in categories" :key="category.id">
        <template v-if="editingId === category.id">
          <input v-model="editName" @keyup.enter="handleUpdate(category.id)" />
          <button @click="handleUpdate(category.id)">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </template>
        <template v-else>
          <span>{{ category.name }}</span>
          <button @click="startEdit(category)">Edit</button>
          <button @click="handleDelete(category.id)">Delete</button>
        </template>
      </li>
    </ul>

    <p v-if="error" class="error">{{ error }}</p>
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
  if (!newCategoryName.value.trim()) return
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
  if (!editName.value.trim()) return
  try {
    await store.dispatch('categories/updateCategory', { id, name: editName.value })
    editingId.value = null
    editName.value = ''
  } catch {
  }
}

const handleDelete = async (id) => {
  if (!confirm('Delete this category?')) return
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
.error {
  color: red;
  margin-top: 10px;
}
</style>