import { createRouter, createWebHashHistory } from 'vue-router';
import UserProfile from './components/UserProfile.vue';
import TaskRecords from './components/TaskRecords.vue';

const routes = [
  { path: '/', name: 'Profile', component: UserProfile },
  { path: '/tasks', name: 'TaskRecords', component: TaskRecords }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
