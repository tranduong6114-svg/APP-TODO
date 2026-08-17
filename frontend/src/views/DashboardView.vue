<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>You are logged in as <strong>{{ userName }}</strong>!</p>
    <p>Use the navigation above to manage your categories and tasks.</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const userName = computed(() => store.state.auth.user?.name || 'User')

onMounted(async () => {
  if (!isAuthenticated.value) {
    await store.dispatch('auth/fetchUser')
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.dashboard p {
  margin-top: 10px;
  color: #666;
}
</style>