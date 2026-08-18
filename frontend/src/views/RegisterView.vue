<template>
  <div class="register-page">
    <h1>Đăng ký</h1>
    <form @submit.prevent="handleSubmit" novalidate>
      <input v-model="form.name" type="text" placeholder="Họ tên" autocomplete="name" />
      <input v-model="form.email" type="email" placeholder="Email" autocomplete="email" />
      <input v-model="form.password" type="password" placeholder="Mật khẩu" autocomplete="new-password" />
      <input v-model="form.password_confirmation" type="password" placeholder="Xác nhận mật khẩu" autocomplete="new-password" />
      <button type="submit" :disabled="loading">Đăng ký</button>
    </form>
    <div v-if="error" class="error-box">{{ error }}</div>
    <ul v-if="errors" class="errors">
      <li v-for="(msgs, field) in errors" :key="field">{{ msgs[0] }}</li>
    </ul>
    <p class="hint">
      Đã có tài khoản?
      <router-link to="/login">Đăng nhập</router-link>
    </p>
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
const errors = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  errors.value = null

  try {
    await store.dispatch('auth/register', form.value)
    router.push('/dashboard')
  } catch (err) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Đăng ký thất bại. Vui lòng thử lại.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  padding: 20px;
  max-width: 360px;
  margin: 40px auto;
}
h1 {
  margin-bottom: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #999;
  cursor: not-allowed;
}
.error-box {
  color: #b00020;
  background: #fde8e8;
  border: 1px solid #f5c2c2;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
}
.errors {
  color: #b00020;
  background: #fde8e8;
  border: 1px solid #f5c2c2;
  border-radius: 4px;
  padding: 10px 10px 10px 30px;
  margin-top: 10px;
}
.hint {
  margin-top: 15px;
  color: #666;
}
</style>
