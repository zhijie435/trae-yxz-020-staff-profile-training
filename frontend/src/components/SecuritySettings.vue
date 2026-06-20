<template>
  <div class="security-settings">
    <div class="page-header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </div>
      <div class="page-title">账号安全</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content" v-if="!loading">
      <div class="user-info-card">
        <div class="user-avatar">
          <span>{{ nameInitial }}</span>
        </div>
        <div class="user-details">
          <div class="user-name">{{ settings.name }}</div>
          <div class="user-id">工号：{{ settings.employeeId }}</div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">账号安全</h3>
        <div class="settings-list">
          <div class="setting-item" @click="showPasswordModal = true">
            <div class="setting-icon password-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div class="setting-info">
              <div class="setting-label">修改密码</div>
              <div class="setting-desc">上次修改：{{ settings.lastPasswordChange }}</div>
            </div>
            <svg class="setting-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">登录设备管理</h3>
        <div class="devices-list">
          <div
            class="device-item"
            v-for="device in settings.loginDevices"
            :key="device.id"
          >
            <div class="device-icon" :class="'icon-' + device.type">
              <svg v-if="device.type === 'mobile'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div class="device-info">
              <div class="device-name">
                {{ device.name }}
                <span class="current-badge" v-if="device.current">当前设备</span>
              </div>
              <div class="device-last-login">最后登录：{{ device.lastLogin }}</div>
            </div>
            <button
              class="logout-device-btn"
              v-if="!device.current"
              @click="handleLogoutDevice(device.id)"
            >
              退出
            </button>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">安全提示</h3>
        <div class="security-tips">
          <div class="tip-item">
            <svg class="tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>请定期修改密码，建议使用大小写字母、数字和符号的组合</span>
          </div>
          <div class="tip-item">
            <svg class="tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>如发现陌生设备登录，请及时退出并修改密码</span>
          </div>
          <div class="tip-item">
            <svg class="tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>请勿在公共设备上勾选"记住密码"选项</span>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-state" v-if="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>

    <div class="error-message" v-if="error">{{ error }}</div>

    <div class="modal-overlay" v-if="showPasswordModal" @click.self="closePasswordModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>修改密码</h3>
          <div class="modal-close" @click="closePasswordModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>当前密码</label>
            <input
              type="password"
              v-model="passwordForm.oldPassword"
              placeholder="请输入当前密码"
            />
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input
              type="password"
              v-model="passwordForm.newPassword"
              placeholder="请输入新密码（至少6位）"
            />
          </div>
          <div class="form-group">
            <label>确认新密码</label>
            <input
              type="password"
              v-model="passwordForm.confirmPassword"
              placeholder="请再次输入新密码"
            />
          </div>
          <div class="form-error" v-if="passwordError">{{ passwordError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="closePasswordModal">取消</button>
          <button class="btn btn-confirm" @click="handleChangePassword" :disabled="passwordSubmitting">
            {{ passwordSubmitting ? '提交中...' : '确认修改' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../utils/api';

const router = useRouter();

const settings = ref({
  employeeId: '',
  name: '',
  hasPassword: false,
  lastPasswordChange: '',
  loginDevices: []
});

const loading = ref(true);
const error = ref('');

const nameInitial = computed(() => {
  return settings.value.name ? settings.value.name.charAt(0) : '?';
});

const showPasswordModal = ref(false);
const passwordSubmitting = ref(false);
const passwordError = ref('');
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const goBack = () => {
  router.push('/');
};

const fetchSettings = async () => {
  loading.value = true;
  error.value = '';
  try {
    const result = await api.security.getSettings(router);
    if (result && result.code === 0) {
      settings.value = result.data;
    } else {
      error.value = result?.message || '获取设置失败';
    }
  } finally {
    loading.value = false;
  }
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
  passwordError.value = '';
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
};

const handleChangePassword = async () => {
  const { oldPassword, newPassword, confirmPassword } = passwordForm;

  if (!oldPassword || !newPassword || !confirmPassword) {
    passwordError.value = '请填写所有密码字段';
    return;
  }
  if (newPassword.length < 6) {
    passwordError.value = '新密码长度至少6位';
    return;
  }
  if (newPassword !== confirmPassword) {
    passwordError.value = '两次输入的新密码不一致';
    return;
  }

  passwordError.value = '';
  passwordSubmitting.value = true;

  try {
    const result = await api.security.changePassword(
      { oldPassword, newPassword },
      router
    );

    if (result && result.code === 0) {
      alert('密码修改成功，请重新登录');
      closePasswordModal();
      localStorage.removeItem('token');
      localStorage.removeItem('employeeInfo');
      router.push('/login');
    } else {
      passwordError.value = result?.message || '密码修改失败';
    }
  } finally {
    passwordSubmitting.value = false;
  }
};

const handleLogoutDevice = async (deviceId) => {
  if (!confirm('确定要退出该设备吗？')) return;

  try {
    const result = await api.security.logoutDevice(deviceId, router);
    if (result && result.code === 0) {
      alert('设备已退出登录');
      settings.value.loginDevices = settings.value.loginDevices.filter(
        d => d.id !== deviceId
      );
    } else {
      alert(result?.message || '操作失败');
    }
  } catch (e) {
    alert('操作失败，请稍后重试');
  }
};

onMounted(fetchSettings);
</script>

<style scoped>
.security-settings {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #fff;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.2);
}

.back-btn svg {
  width: 22px;
  height: 22px;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}

.header-spacer {
  width: 36px;
}

.content {
  padding: 16px;
}

.user-info-card {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  color: #fff;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-id {
  font-size: 14px;
  opacity: 0.9;
}

.section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px;
}

.settings-list {
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:active {
  background-color: #f9f9f9;
}

.setting-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.setting-icon svg {
  width: 22px;
  height: 22px;
}

.password-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.setting-desc {
  font-size: 12px;
  color: #999;
}

.setting-arrow {
  width: 18px;
  height: 18px;
  color: #ccc;
  flex-shrink: 0;
}

.devices-list {
  overflow: hidden;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.device-item:last-child {
  border-bottom: none;
}

.device-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.device-icon svg {
  width: 22px;
  height: 22px;
}

.icon-mobile {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.icon-desktop {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.device-info {
  flex: 1;
}

.device-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-badge {
  padding: 2px 8px;
  background: #f6ffed;
  color: #52c41a;
  font-size: 11px;
  border-radius: 4px;
}

.device-last-login {
  font-size: 12px;
  color: #999;
}

.logout-device-btn {
  padding: 6px 16px;
  background: #fff1f0;
  color: #ff4d4f;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-device-btn:active {
  background: #ffccc7;
}

.security-tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.tip-icon {
  width: 18px;
  height: 18px;
  color: #faad14;
  flex-shrink: 0;
  margin-top: 1px;
}

.loading-state {
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #fa709a;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #666;
}

.error-message {
  padding: 16px;
  margin: 16px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #ff4d4f;
  font-size: 14px;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: #f5f5f5;
}

.modal-close svg {
  width: 20px;
  height: 20px;
  color: #999;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-of-type {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  height: 44px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #fa709a;
}

.form-group input::placeholder {
  color: #bbb;
}

.form-error {
  margin-top: 12px;
  font-size: 13px;
  color: #ff4d4f;
  text-align: center;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.btn {
  flex: 1;
  height: 44px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.btn:active {
  opacity: 0.8;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-confirm {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #fff;
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
