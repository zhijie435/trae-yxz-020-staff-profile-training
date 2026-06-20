import { createRouter, createWebHashHistory } from 'vue-router';
import UserProfile from './components/UserProfile.vue';
import TaskRecords from './components/TaskRecords.vue';
import TrainingMaterials from './components/TrainingMaterials.vue';
import SecuritySettings from './components/SecuritySettings.vue';
import Login from './components/Login.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login, meta: { requiresAuth: false } },
  { path: '/', name: 'Profile', component: UserProfile, meta: { requiresAuth: true } },
  { path: '/tasks', name: 'TaskRecords', component: TaskRecords, meta: { requiresAuth: true } },
  { path: '/training', name: 'TrainingMaterials', component: TrainingMaterials, meta: { requiresAuth: true } },
  { path: '/security', name: 'SecuritySettings', component: SecuritySettings, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !token) {
    next({ path: '/login' });
  } else if (to.path === '/login' && token) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
