<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="form.name" type="text" placeholder="Name" required />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model="form.password" type="password" placeholder="Password" required />
      <input v-model="form.password_confirmation" type="password" placeholder="Confirm Password" required />
      <button type="submit" :disabled="loading">Register</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p>Already have an account? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const loading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    await store.dispatch('auth/register', form.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  padding: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
}
input {
  padding: 8px;
}
button {
  padding: 8px;
}
.error {
  color: red;
}
</style>