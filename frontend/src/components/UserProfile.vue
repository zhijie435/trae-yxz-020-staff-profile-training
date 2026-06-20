<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar">
        <span>{{ initials }}</span>
      </div>
      <div class="user-info" v-if="!loading">
        <div class="name">{{ profile.name }}</div>
        <div class="employee-id">工号：{{ profile.employeeId }}</div>
      </div>
      <div class="user-info skeleton" v-else>
        <div class="skeleton-line name-line"></div>
        <div class="skeleton-line id-line"></div>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat-card main-stat">
        <div class="stat-value" v-if="!loading">{{ profile.completedTasks }}</div>
        <div class="stat-value skeleton-value" v-else></div>
        <div class="stat-label">累计完成任务数</div>
      </div>
    </div>

    <div class="task-stats-section">
      <h3 class="section-title">任务统计</h3>
      <div class="task-stats-grid">
        <div class="task-stat-card">
          <div class="task-stat-icon monthly-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="task-stat-info">
            <div class="task-stat-value" v-if="!loading">
              <span class="number">{{ profile.monthlyCompletedTasks }}</span>
              <span class="unit">个</span>
            </div>
            <div class="task-stat-value skeleton-value" v-else></div>
            <div class="task-stat-label">本月完成任务</div>
          </div>
        </div>

        <div class="task-stat-card">
          <div class="task-stat-icon delivery-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L7 14V16"/>
              <rect x="5" y="16" width="14" height="6" rx="2"/>
              <circle cx="8.5" cy="20" r="1.5"/>
              <circle cx="15.5" cy="20" r="1.5"/>
            </svg>
          </div>
          <div class="task-stat-info">
            <div class="task-stat-value" v-if="!loading">
              <span class="number">{{ profile.deliveryRate }}</span>
              <span class="unit">%</span>
            </div>
            <div class="task-stat-value skeleton-value" v-else></div>
            <div class="task-stat-label">交付完成率</div>
          </div>
        </div>

        <div class="task-stat-card">
          <div class="task-stat-icon satisfaction-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div class="task-stat-info">
            <div class="task-stat-value" v-if="!loading">
              <span class="number">{{ profile.satisfactionRate }}</span>
              <span class="unit">%</span>
            </div>
            <div class="task-stat-value skeleton-value" v-else></div>
            <div class="task-stat-label">用户好评率</div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <h3 class="section-title">功能入口</h3>
      <div class="features-grid">
        <div class="feature-item" @click="handleFeatureClick('tasks')">
          <div class="feature-icon feature-tasks">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div class="feature-label">我的任务记录</div>
          <svg class="feature-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        <div class="feature-item" @click="handleFeatureClick('help')">
          <div class="feature-icon feature-help">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="feature-label">帮助中心</div>
          <svg class="feature-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        <div class="feature-item" @click="handleFeatureClick('contact')">
          <div class="feature-icon feature-contact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div class="feature-label">联系门店管理员</div>
          <svg class="feature-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        <div class="feature-item" @click="handleFeatureClick('training')">
          <div class="feature-icon feature-training">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div class="feature-label">在线培训资料</div>
          <svg class="feature-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        <div class="feature-item" @click="handleFeatureClick('trainingManage')">
          <div class="feature-icon feature-training-manage">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <div class="feature-label">在线培训资料管理</div>
          <svg class="feature-external" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h3 class="section-title">设置</h3>
      <div class="settings-grid">
        <div class="settings-item" @click="showPasswordModal = true">
          <div class="settings-icon settings-password">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div class="settings-label">修改密码</div>
          <svg class="settings-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        <div class="settings-item settings-item-danger" @click="handleLogout">
          <div class="settings-icon settings-logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <div class="settings-label">退出登录</div>
          <svg class="settings-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>

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

    <div class="error-message" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const profile = ref({
  name: '',
  employeeId: '',
  completedTasks: 0,
  monthlyCompletedTasks: 0,
  deliveryRate: 0,
  satisfactionRate: 0
});
const loading = ref(true);
const error = ref('');

const initials = computed(() => {
  if (!profile.value.name) return '?';
  return profile.value.name.charAt(0);
});

const fetchProfile = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('/api/employee/profile');
    const result = await res.json();
    if (result.code === 0) {
      profile.value = result.data;
    } else {
      error.value = result.message || '获取数据失败';
    }
  } catch (e) {
    error.value = '网络请求失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

const showPasswordModal = ref(false);
const passwordSubmitting = ref(false);
const passwordError = ref('');
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const handleLogout = async () => {
  if (!confirm('确定要退出登录吗？')) return;
  try {
    await fetch('/api/employee/logout', { method: 'POST' });
  } catch (e) {
    // ignore
  }
  localStorage.removeItem('token');
  alert('已退出登录');
  window.location.reload();
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
  passwordError.value = '';
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
};

const handleChangePassword = async () => {
  const { oldPassword, newPassword, confirmPassword } = passwordForm.value;
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
    const res = await fetch('/api/employee/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    const result = await res.json();
    if (result.code === 0) {
      alert('密码修改成功，请重新登录');
      closePasswordModal();
      localStorage.removeItem('token');
      window.location.reload();
    } else {
      passwordError.value = result.message || '密码修改失败';
    }
  } catch (e) {
    passwordError.value = '网络请求失败，请稍后重试';
  } finally {
    passwordSubmitting.value = false;
  }
};

const featureNames = {
  tasks: '我的任务记录',
  help: '帮助中心',
  contact: '联系门店管理员',
  training: '在线培训资料',
  trainingManage: '在线培训资料管理'
};

const featureUrls = {
  trainingManage: 'https://hq-admin.example.com/training'
};

const handleFeatureClick = (feature) => {
  if (feature === 'tasks') {
    router.push('/tasks');
    return;
  }
  if (feature === 'trainingManage') {
    const url = featureUrls[feature];
    console.log(`跳转到总部后台：${url}`);
    window.open(url, '_blank');
    return;
  }
  console.log(`点击功能入口：${featureNames[feature]}`);
  alert(`即将进入：${featureNames[feature]}`);
};

onMounted(fetchProfile);
</script>

<style scoped>
.user-profile {
  padding: 0;
}

.profile-header {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  padding: 32px 20px 40px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  color: #fff;
}

.name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
}

.employee-id {
  font-size: 14px;
  opacity: 0.85;
}

.skeleton-line {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

.name-line {
  height: 22px;
  width: 80px;
  margin-bottom: 10px;
}

.id-line {
  height: 16px;
  width: 120px;
}

.stats-section {
  padding: 0 16px;
  margin-top: -20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #4a90e2;
  line-height: 1.2;
  margin-bottom: 8px;
}

.stat-value.skeleton-value {
  width: 80px;
  height: 44px;
  background: #f0f2f5;
  border-radius: 8px;
  margin: 0 auto 8px;
  animation: pulse 1.5s ease-in-out infinite;
}

.stat-label {
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

.task-stats-section {
  padding: 20px 16px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.task-stats-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.task-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.task-stat-icon svg {
  width: 24px;
  height: 24px;
}

.monthly-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.delivery-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.satisfaction-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.task-stat-info {
  flex: 1;
}

.task-stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.task-stat-value .number {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.task-stat-value .unit {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.task-stat-value.skeleton-value {
  width: 100px;
  height: 28px;
  background: #f0f2f5;
  border-radius: 6px;
  margin-bottom: 8px;
  animation: pulse 1.5s ease-in-out infinite;
}

.task-stat-label {
  font-size: 13px;
  color: #999;
}

.features-section {
  padding: 20px 16px 24px;
}

.features-grid {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-item:active {
  background-color: #f9f9f9;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 22px;
  height: 22px;
}

.feature-tasks {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.feature-help {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.feature-contact {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.feature-training {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
}

.feature-training-manage {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.feature-label {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.feature-arrow {
  width: 18px;
  height: 18px;
  color: #ccc;
  flex-shrink: 0;
}

.feature-external {
  width: 18px;
  height: 18px;
  color: #999;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.settings-section {
  padding: 0 16px 24px;
}

.settings-grid {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item:active {
  background-color: #f9f9f9;
}

.settings-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.settings-icon svg {
  width: 22px;
  height: 22px;
}

.settings-password {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #fff;
}

.settings-logout {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: #fff;
}

.settings-label {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.settings-item-danger .settings-label {
  color: #ff4d4f;
}

.settings-arrow {
  width: 18px;
  height: 18px;
  color: #ccc;
  flex-shrink: 0;
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
  border-color: #4a90e2;
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
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: #fff;
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
