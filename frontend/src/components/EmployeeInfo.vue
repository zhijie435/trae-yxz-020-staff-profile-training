<template>
  <div class="employee-info-card">
    <div class="avatar-section">
      <div class="avatar">
        {{ initial }}
      </div>
    </div>
    
    <div class="info-section">
      <div class="info-item name-item">
        <span class="label">姓名</span>
        <span class="value">{{ employee.name || '-' }}</span>
      </div>
      
      <div class="info-item">
        <span class="label">工号</span>
        <span class="value">{{ employee.employeeId || '-' }}</span>
      </div>
      
      <div class="info-item tasks-item">
        <span class="label">累计完成任务</span>
        <span class="value tasks-value">
          <span class="tasks-number">{{ employee.completedTasks || 0 }}</span>
          <span class="tasks-unit">个</span>
        </span>
      </div>
    </div>
    
    <div v-if="loading" class="loading-mask">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const employee = ref({
  name: '',
  employeeId: '',
  completedTasks: 0
});

const loading = ref(false);

const initial = computed(() => {
  return employee.value.name ? employee.value.name.charAt(0) : '?';
});

const fetchEmployeeInfo = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/employee');
    employee.value = response.data;
  } catch (error) {
    console.error('获取员工信息失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEmployeeInfo();
});
</script>

<style scoped>
.employee-info-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 30px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32px;
  font-weight: 600;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.label {
  color: #999;
  font-size: 15px;
}

.value {
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.name-item .value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.tasks-item {
  padding-top: 8px;
}

.tasks-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.tasks-number {
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
}

.tasks-unit {
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
