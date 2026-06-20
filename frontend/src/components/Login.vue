<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h2>员工端登录</h2>
        <p class="subtitle">请输入工号和密码登录</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label>工号</label>
          <input
            type="text"
            v-model="loginForm.employeeId"
            placeholder="请输入工号"
            :disabled="submitting"
          />
        </div>

        <div class="form-group">
          <label>密码</label>
          <input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            :disabled="submitting"
          />
        </div>

        <div class="form-error" v-if="error">{{ error }}</div>

        <button type="submit" class="btn-login" :disabled="submitting">
          {{ submitting ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="login-tip">
        <p>测试账号：EMP001 / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginForm = ref({
  employeeId: '',
  password: ''
});
const submitting = ref(false);
const error = ref('');

const handleLogin = async () => {
  const { employeeId, password } = loginForm.value;

  if (!employeeId || !password) {
    error.value = '请输入工号和密码';
    return;
  }

  error.value = '';
  submitting.value = true;

  try {
    const res = await fetch('/api/employee/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, password })
    });
    const result = await res.json();

    if (result.code === 0) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('employeeInfo', JSON.stringify(result.data.employee));
      router.push('/');
    } else {
      error.value = result.message || '登录失败';
    }
  } catch (e) {
    error.value = '网络请求失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.logo svg {
  width: 32px;
  height: 32px;
}

.login-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #667eea;
}

.form-group input::placeholder {
  color: #bbb;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-error {
  font-size: 13px;
  color: #ff4d4f;
  text-align: center;
  margin-top: -4px;
}

.btn-login {
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-login:active {
  opacity: 0.9;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-tip {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: #999;
}

.login-tip p {
  margin: 0;
}
</style>
