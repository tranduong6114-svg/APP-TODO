<template>
  <div class="dashboard">
    <h1>Welcome, {{ user?.name }}</h1>
    <p>You are logged in!</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters['auth/user'])
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

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
</style>