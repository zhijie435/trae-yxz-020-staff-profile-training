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
      <div class="stat-card">
        <div class="stat-value" v-if="!loading">{{ profile.completedTasks }}</div>
        <div class="stat-value skeleton-value" v-else></div>
        <div class="stat-label">累计完成任务数</div>
      </div>
    </div>

    <div class="error-message" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const profile = ref({
  name: '',
  employeeId: '',
  completedTasks: 0
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

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
