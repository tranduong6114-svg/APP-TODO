<template>
  <div id="app">
    <nav v-if="isAuthenticated">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/categories">Categories</router-link>
      <router-link to="/tasks">Tasks</router-link>
      <span>Welcome, {{ user?.name }}</span>
      <button @click="handleLogout">Logout</button>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
</script>

<style scoped>
#app {
  padding: 20px;
}
nav {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: #f5f5f5;
  margin-bottom: 20px;
}
nav a {
  text-decoration: none;
  color: #333;
  padding: 5px 10px;
}
nav a.router-link-active {
  background: #ddd;
  border-radius: 4px;
}
nav span {
  margin-left: auto;
}
nav button {
  padding: 6px 12px;
}
</style>