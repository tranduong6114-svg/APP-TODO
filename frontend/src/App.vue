<template>
  <div id="app">
    <nav v-if="isAuthenticated" class="top-nav">
      <router-link to="/dashboard">Trang chủ</router-link>
      <router-link to="/categories">Danh mục</router-link>
      <router-link to="/tasks">Công việc</router-link>
      <span class="user">Xin chào, {{ user?.name }}</span>
      <button @click="handleLogout">Đăng xuất</button>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const user = computed(() => store.getters['auth/user'])

const handleLogout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    await store.dispatch('auth/fetchUser')
  }
})
</script>

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, sans-serif;
  color: #333;
  min-height: 100vh;
  background: #fafafa;
}
.top-nav {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.top-nav a {
  text-decoration: none;
  color: #555;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.2s;
}
.top-nav a:hover {
  background: #f0f0f0;
}
.top-nav a.router-link-active {
  background: #1976d2;
  color: #fff;
}
.user {
  margin-left: auto;
  color: #666;
  font-size: 14px;
}
button {
  padding: 6px 14px;
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #b71c1c;
}
</style>
