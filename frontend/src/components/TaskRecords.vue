<template>
  <div class="task-records">
    <div class="page-header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </div>
      <div class="page-title">我的任务记录</div>
      <div class="header-spacer"></div>
    </div>

    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>月份</label>
          <select v-model="filters.month">
            <option value="">全部</option>
            <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label>任务类型</label>
          <select v-model="filters.type">
            <option value="">全部</option>
            <option v-for="t in taskTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label>完成状态</label>
          <select v-model="filters.status">
            <option value="">全部</option>
            <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>
      </div>
      <div class="filter-actions">
        <button class="reset-btn" @click="resetFilters">重置</button>
        <button class="search-btn" @click="fetchTasks">查询</button>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stats-text">
        共 <span class="highlight">{{ total }}</span> 条记录</div>
    </div>

    <div class="task-list" v-if="!loading && tasks.length > 0">
      <div class="task-card" v-for="task in tasks" :key="task.id">
        <div class="task-header">
          <div class="task-title">{{ task.title }}</div>
          <div class="task-badge" :class="'status-' + task.status">{{ getStatusLabel(task.status) }}</div>
        </div>
        <div class="task-info">
          <div class="task-info-item">
            <span class="info-label">任务编号</span>
            <span class="info-value">{{ task.taskNo }}</span>
          </div>
          <div class="task-info-item">
            <span class="info-label">任务类型</span>
            <span class="info-value">{{ getTypeLabel(task.type) }}</span>
          </div>
          <div class="task-info-item">
            <span class="info-label">完成时间</span>
            <span class="info-value">{{ task.completedAt || '-' }}</span>
          </div>
          <div class="task-info-item">
            <span class="info-value task-score" v-if="task.score">
              <span class="score-label">评分</span>
              <span class="score-value">{{ task.score }}分</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="!loading && tasks.length === 0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <div class="empty-text">暂无任务记录</div>
    </div>

    <div class="loading-state" v-if="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>

    <div class="error-message" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const months = [];
for (let y = currentYear; y >= currentYear - 1; y--) {
  for (let m = 1; m <= 12; m++) {
    if (y === currentYear && m > currentMonth) continue;
    months.push({
      value: `${y}-${String(m).padStart(2, '0')}`,
      label: `${y}年${m}月`
    });
  }
}

const taskTypes = [
  { value: 'delivery', label: '配送' },
  { value: 'install', label: '安装' },
  { value: 'service', label: '服务' },
  { value: 'training', label: '培训' }
];

const statusOptions = [
  { value: 'completed', label: '已完成' },
  { value: 'in_progress', label: '进行中' },
  { value: 'pending', label: '待处理' },
  { value: 'cancelled', label: '已取消' }
];

const filters = reactive({
  month: `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
  type: '',
  status: ''
});

const tasks = ref([]);
const loading = ref(true);
const error = ref('');
const total = ref(0);

const goBack = () => {
  router.push('/');
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const handleAuthError = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('employeeInfo');
  router.push('/login');
};

const getTypeLabel = (type) => {
  const t = taskTypes.find(item => item.value === type);
  return t ? t.label : type;
};

const getStatusLabel = (status) => {
  const s = statusOptions.find(item => item.value === status);
  return s ? s.label : status;
};

const resetFilters = () => {
  filters.month = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  filters.type = '';
  filters.status = '';
  fetchTasks();
};

const fetchTasks = async () => {
  loading.value = true;
  error.value = '';
  try {
    const params = new URLSearchParams();
    if (filters.month) params.append('month', filters.month);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    const res = await fetch(`/api/employee/tasks?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    if (res.status === 401) {
      handleAuthError();
      return;
    }
    const result = await res.json();
    if (result.code === 0) {
      tasks.value = result.data.list;
      total.value = result.data.total;
    } else {
      error.value = result.message || '获取数据失败';
    }
  } catch (e) {
    error.value = '网络请求失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTasks);
</script>

<style scoped>
.task-records {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
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

.filter-section {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.filter-item {
  flex: 1;
}

.filter-item label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.filter-item select {
  width: 100%;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #333;
  background: #fff;
  outline: none;
}

.filter-item select:focus {
  border-color: #4a90e2;
}

.filter-actions {
  display: flex;
  gap: 12px;
}

.reset-btn, .search-btn {
  flex: 1;
  height: 42px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.reset-btn {
  background: #f5f5f5;
  color: #666;
}

.search-btn {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: #fff;
}

.reset-btn:active, .search-btn:active {
  opacity: 0.8;
}

.stats-bar {
  padding: 0 20px 12px;
}

.stats-text {
  font-size: 13px;
  color: #999;
}

.highlight {
  color: #4a90e2;
  font-weight: 600;
}

.task-list {
  padding: 0 16px 24px;
}

.task-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 12px;
}

.task-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.status-completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-in_progress {
  background: #e6f7ff;
  color: #1890ff;
}

.status-pending {
  background: #fffbe6;
  color: #faad14;
}

.status-cancelled {
  background: #f5f5f5;
  color: #999;
}

.task-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
}

.task-info-item {
  font-size: 13px;
}

.info-label {
  color: #999;
  margin-right: 6px;
}

.info-value {
  color: #333;
}

.task-score {
  display: flex;
  align-items: center;
}

.score-label {
  color: #999;
  margin-right: 6px;
}

.score-value {
  color: #fa8c16;
  font-weight: 600;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

.loading-state {
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #4a90e2;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
</style>
