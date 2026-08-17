<template>
  <div id="app">
    <nav v-if="isAuthenticated">
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
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  margin-bottom: 20px;
}
button {
  padding: 6px 12px;
}
</style>