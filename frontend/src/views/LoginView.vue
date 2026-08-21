<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <span class="auth-icon">🔐</span>
        <h1>Đăng nhập</h1>
        <p class="auth-subtitle">Chào mừng bạn quay lại!</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form" novalidate>
        <div class="form-group">
          <label class="form-label">
            <span>📧</span>
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@email.com"
            autocomplete="username"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <span>🔑</span>
            Mật khẩu
          </label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Nhập mật khẩu..."
            autocomplete="current-password"
            class="form-input"
          />
        </div>

        <div v-if="error" class="alert alert-error">
          <span>⚠️</span>
          {{ error }}
        </div>

        <ul v-if="errors" class="alert alert-error-list">
          <li v-for="(msgs, field) in errors" :key="field">
            <strong>{{ field }}:</strong> {{ msgs[0] }}
          </li>
        </ul>

        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary btn-block"
        >
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>

      <p class="auth-hint">
        Chưa có tài khoản?
        <router-link to="/register" class="auth-link">Đăng ký ngay</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
})
const loading = ref(false)
const error = ref(null)
const errors = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  errors.value = null

  try {
    await store.dispatch('auth/login', form.value)
    router.push('/tasks')
  } catch (err) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Đăng nhập thất bại. Vui lòng thử lại.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--space-lg) * 2);
  padding: var(--space-lg);
}

.auth-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.auth-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--space-sm);
}

.auth-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: var(--space-xs);
}

.auth-subtitle {
  color: var(--gray-500);
  font-size: 14px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-700);
}

.form-input {
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 15px;
  transition: border-color 0.15s ease;
  background: var(--bg-card);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: 12px 18px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-block {
  width: 100%;
}

.alert {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.alert-error,
.alert-error-list {
  background: var(--danger-light);
  color: var(--danger-hover);
  border: 1px solid var(--danger);
}

.alert-error-list {
  list-style: disc;
  padding-left: 30px;
  flex-direction: column;
  align-items: flex-start;
}

.auth-hint {
  text-align: center;
  margin-top: var(--space-md);
  color: var(--gray-500);
  font-size: 14px;
}

.auth-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
