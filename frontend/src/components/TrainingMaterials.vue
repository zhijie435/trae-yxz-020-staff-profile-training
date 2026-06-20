<template>
  <div class="training-materials">
    <div class="page-header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </div>
      <div class="page-title">在线培训资料</div>
      <div class="header-spacer"></div>
    </div>

    <div class="stats-section" v-if="!loading">
      <div class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ stats.total }}</div>
          <div class="stats-label">全部课程</div>
        </div>
        <div class="stats-item">
          <div class="stats-value completed">{{ stats.completed }}</div>
          <div class="stats-label">已完成</div>
        </div>
        <div class="stats-item">
          <div class="stats-value in-progress">{{ stats.inProgress }}</div>
          <div class="stats-label">学习中</div>
        </div>
        <div class="stats-item">
          <div class="stats-value not-started">{{ stats.notStarted }}</div>
          <div class="stats-label">未开始</div>
        </div>
      </div>
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">总体学习进度</span>
          <span class="progress-text">{{ stats.totalProgress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: stats.totalProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-tabs">
        <div
          class="filter-tab"
          :class="{ active: activeTab === 'all' }"
          @click="activeTab = 'all'; fetchMaterials()"
        >
          全部
        </div>
        <div
          class="filter-tab"
          :class="{ active: activeTab === 'completed' }"
          @click="activeTab = 'completed'; fetchMaterials()"
        >
          已完成
        </div>
        <div
          class="filter-tab"
          :class="{ active: activeTab === 'in_progress' }"
          @click="activeTab = 'in_progress'; fetchMaterials()"
        >
          学习中
        </div>
        <div
          class="filter-tab"
          :class="{ active: activeTab === 'not_started' }"
          @click="activeTab = 'not_started'; fetchMaterials()"
        >
          未开始
        </div>
      </div>
      <div class="filter-selects">
        <select v-model="filters.category" @change="fetchMaterials()">
          <option value="">全部分类</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-model="filters.level" @change="fetchMaterials()">
          <option value="">全部等级</option>
          <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>
    </div>

    <div class="material-list" v-if="!loading && materials.length > 0">
      <div
        class="material-card"
        v-for="material in materials"
        :key="material.id"
        @click="openMaterialDetail(material)"
      >
        <div class="material-cover" :class="'cover-' + material.cover">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>
        <div class="material-info">
          <div class="material-title">{{ material.title }}</div>
          <div class="material-meta">
            <span class="badge category">{{ material.category }}</span>
            <span class="badge level" :class="'level-' + material.level">{{ material.level }}</span>
            <span class="duration">{{ material.duration }}</span>
          </div>
          <div class="material-desc">{{ material.description }}</div>
          <div class="material-footer">
            <div class="view-count">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {{ material.viewCount }}
            </div>
            <div class="material-progress" v-if="material.progress > 0">
              <div class="progress-bar-small">
                <div
                  class="progress-fill-small" :style="{ width: material.progress + '%' }"></div>
              </div>
              <span class="progress-text-small">{{ material.progress }}%</span>
            </div>
            <span class="status-badge" v-if="material.progress === 100">已完成</span>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="!loading && materials.length === 0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      <div class="empty-text">暂无培训资料</div>
    </div>

    <div class="loading-state" v-if="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>

    <div class="error-message" v-if="error">{{ error }}</div>

    <div class="modal-overlay" v-if="showDetailModal" @click.self="closeDetailModal">
      <div class="modal-content detail-modal">
        <div class="modal-header">
          <h3>{{ currentMaterial?.title }}</h3>
          <div class="modal-close" @click="closeDetailModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        </div>
        <div class="modal-body">
          <div class="detail-cover" :class="'cover-' + currentMaterial?.cover">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div class="detail-info">
            <div class="detail-meta">
              <span class="badge category">{{ currentMaterial?.category }}</span>
              <span class="badge level" :class="'level-' + currentMaterial?.level">{{ currentMaterial?.level }}</span>
              <span class="duration">{{ currentMaterial?.duration }}</span>
            </div>
            <p class="detail-desc">{{ currentMaterial?.description }}</p>
            <div class="detail-stats">
              <div class="stat-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {{ currentMaterial?.viewCount }} 次学习
              </div>
              <div class="stat-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <path d="M16 2v4"/>
                  <path d="M8 2v4"/>
                  <path d="M3 10h18"/>
                </svg>
                {{ currentMaterial?.createdAt }}
              </div>
            </div>
            <div class="detail-progress">
              <div class="progress-label">学习进度</div>
              <div class="progress-control">
                <input
                  type="range"
                  v-model.number="progressValue"
                  min="0"
                  max="100"
                  @change="handleProgressChange"
                />
                <span class="progress-value">{{ progressValue }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="closeDetailModal">关闭</button>
          <button class="btn btn-primary" @click="startLearning">
            {{ progressValue > 0 ? '继续学习' : '开始学习' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../utils/api';

const router = useRouter();

const activeTab = ref('all');
const filters = reactive({
  category: '',
  level: ''
});

const materials = ref([]);
const stats = ref({
  total: 0,
  completed: 0,
  inProgress: 0,
  notStarted: 0,
  totalProgress: 0
});
const categories = ref([]);
const levels = ref([]);
const loading = ref(true);
const error = ref('');

const showDetailModal = ref(false);
const currentMaterial = ref(null);
const progressValue = ref(0);
const progressSaving = ref(false);

const goBack = () => {
  router.push('/');
};

const filterMaterialsByTab = (list) => {
  if (activeTab.value === 'all') return list;
  if (activeTab.value === 'completed') return list.filter(m => m.progress === 100);
  if (activeTab.value === 'in_progress') return list.filter(m => m.progress > 0 && m.progress < 100);
  if (activeTab.value === 'not_started') return list.filter(m => m.progress === 0);
  return list;
};

const fetchCategories = async () => {
  const result = await api.training.getCategories(router);
  if (result && result.code === 0) {
    categories.value = result.data.categories;
    levels.value = result.data.levels;
  }
};

const fetchStats = async () => {
  const result = await api.training.getStats(router);
  if (result && result.code === 0) {
    stats.value = result.data;
  }
};

const fetchMaterials = async () => {
  loading.value = true;
  error.value = '';
  try {
    const result = await api.training.getList(filters, router);
    if (result && result.code === 0) {
      materials.value = filterMaterialsByTab(result.data.list);
    } else {
      error.value = result?.message || '获取数据失败';
    }
  } finally {
    loading.value = false;
  }
};

const openMaterialDetail = async (material) => {
  const result = await api.training.getDetail(material.id, router);
  if (result && result.code === 0) {
    currentMaterial.value = result.data;
    progressValue.value = result.data.progress;
    showDetailModal.value = true;
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  currentMaterial.value = null;
};

const handleProgressChange = async () => {
  if (progressSaving.value) return;
  progressSaving.value = true;
  try {
    const result = await api.training.updateProgress(
      currentMaterial.value.id,
      progressValue.value,
      router
    );
    if (result && result.code === 0) {
      currentMaterial.value.progress = progressValue.value;
      fetchStats();
      fetchMaterials();
    }
  } finally {
    progressSaving.value = false;
  }
};

const startLearning = () => {
  alert(`开始学习：${currentMaterial.value.title}`);
};

onMounted(async () => {
  await fetchCategories();
  await fetchStats();
  await fetchMaterials();
});
</script>

<style scoped>
.training-materials {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
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

.stats-section {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  padding: 0 16px 20px;
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
}

.stats-item {
  text-align: center;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stats-value.completed {
  color: #52c41a;
}

.stats-value.in-progress {
  color: #1890ff;
}

.stats-value.not-started {
  color: #999;
}

.stats-label {
  font-size: 12px;
  color: #999;
}

.progress-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.progress-text {
  font-size: 14px;
  color: #43e97b;
  font-weight: 600;
}

.progress-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.filter-section {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 12px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  overflow-x: auto;
}

.filter-tab {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  background: #f5f5f5;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.filter-tab.active {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
}

.filter-selects {
  display: flex;
  gap: 12px;
}

.filter-selects select {
  flex: 1;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  color: #333;
  background: #fff;
  outline: none;
}

.material-list {
  padding: 0 16px 24px;
}

.material-card {
  display: flex;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s;
}

.material-card:active {
  transform: scale(0.98);
}

.material-cover {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.material-cover svg {
  width: 36px;
  height: 36px;
}

.cover-training {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cover-delivery {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.cover-install {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.cover-service {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.cover-safety {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.cover-efficiency {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.material-info {
  flex: 1;
  min-width: 0;
}

.material-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.material-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.badge.category {
  background: #f0f0f0;
  color: #666;
}

.badge.level {
  background: #e6f7ff;
  color: #1890ff;
}

.badge.level.level-必修 {
  background: #fff1f0;
  color: #ff4d4f;
}

.badge.level.level-高级 {
  background: #fff7e6;
  color: #fa8c16;
}

.duration {
  font-size: 12px;
  color: #999;
}

.material-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.material-footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.view-count svg {
  width: 14px;
  height: 14px;
}

.material-progress {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.progress-bar-small {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill-small {
  height: 100%;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 3px;
}

.progress-text-small {
  font-size: 11px;
  color: #43e97b;
  font-weight: 500;
}

.status-badge {
  padding: 2px 8px;
  background: #f6ffed;
  color: #52c41a;
  font-size: 11px;
  border-radius: 4px;
}

.empty-state, .loading-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.empty-state svg, .loading-state svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.5;
}

.empty-text, .loading-text {
  font-size: 14px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #43e97b;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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
  padding: 20px 24px;
}

.detail-cover {
  height: 160px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 16px;
}

.detail-cover svg {
  width: 64px;
  height: 64px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.detail-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.detail-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
}

.stat-item svg {
  width: 16px;
  height: 16px;
}

.detail-progress {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
}

.progress-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 12px;
}

.progress-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-control input[type="range"] {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: #e0e0e0;
  border-radius: 3px;
  outline: none;
}

.progress-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 50%;
  cursor: pointer;
}

.progress-value {
  font-size: 14px;
  color: #43e97b;
  font-weight: 600;
  min-width: 45px;
  text-align: right;
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

.btn-primary {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
}
</style>
