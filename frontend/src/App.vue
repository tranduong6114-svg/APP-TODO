<template>
  <div id="app">
    <div v-if="isAppLoading" class="app-loading">
      <div class="loading-spinner"></div>
      <p>Đang tải ứng dụng...</p>
    </div>

    <template v-else>
      <nav v-if="isAuthenticated" class="navbar">
        <div class="navbar-brand">
          <span class="brand-icon">✅</span>
          <span class="brand-text">TodoApp</span>
        </div>

        <div class="navbar-menu">
          <router-link to="/tasks" class="nav-link">
            <span>📋</span>
            Công việc
          </router-link>
          <router-link to="/categories" class="nav-link">
            <span>📁</span>
            Danh mục
          </router-link>
        </div>

        <div class="navbar-user">
          <span class="user-greeting">
            <span class="user-icon">👤</span>
            {{ user?.name }}
          </span>
          <button @click="handleLogout" class="btn btn-danger btn-sm">
            Đăng xuất
          </button>
        </div>
      </nav>

      <main class="main-content">
        <router-view />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isAppLoading = ref(true)
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
  isAppLoading.value = false
})
</script>

<style scoped>
.app-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
}

.app-loading p {
  margin-top: var(--space-md);
  font-size: 16px;
  font-weight: 500;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-card);
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}

.brand-icon {
  font-size: 24px;
}

.navbar-menu {
  display: flex;
  gap: var(--space-sm);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--gray-600);
  font-weight: 500;
  transition: all 0.15s ease;
}

.nav-link:hover {
  background: var(--gray-100);
  color: var(--primary);
}

.nav-link.router-link-active {
  background: var(--primary-light);
  color: var(--primary);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--gray-600);
  font-size: 14px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: 10px 18px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 13px;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: var(--danger-hover);
}

.main-content {
  padding: var(--space-lg);
  max-width: 960px;
  margin: 0 auto;
}
</style>
