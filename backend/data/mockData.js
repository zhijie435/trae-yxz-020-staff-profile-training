const employees = [
  {
    id: 1,
    name: '张三',
    employeeId: 'EMP001',
    password: '123456',
    completedTasks: 156,
    monthlyCompletedTasks: 24,
    deliveryRate: 96.5,
    satisfactionRate: 98.2
  },
  {
    id: 2,
    name: '李四',
    employeeId: 'EMP002',
    password: '123456',
    completedTasks: 89,
    monthlyCompletedTasks: 18,
    deliveryRate: 92.3,
    satisfactionRate: 95.8
  },
  {
    id: 3,
    name: '王五',
    employeeId: 'EMP003',
    password: '123456',
    completedTasks: 234,
    monthlyCompletedTasks: 32,
    deliveryRate: 98.7,
    satisfactionRate: 99.1
  }
];

const taskTypes = ['delivery', 'install', 'service', 'training'];
const statuses = ['completed', 'in_progress', 'pending', 'cancelled'];
const statusLabels = {
  delivery: '配送',
  install: '安装',
  service: '服务',
  training: '培训'
};

function generateMockTasks() {
  const tasks = [];
  const now = new Date();
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const taskDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const status = Math.random() > 0.15 ? statuses[Math.floor(Math.random() * 3)] : statuses[3];
    const completedAt = status === 'completed'
      ? taskDate.toISOString().slice(0, 10)
      : null;
    const score = status === 'completed' && Math.random() > 0.3
      ? (Math.floor(Math.random() * 3) + 3) * 20
      : null;
    tasks.push({
      id: i + 1,
      taskNo: `T${String(20260000 + i + 1)}`,
      title: `${statusLabels[type]}任务-${i + 1}`,
      type,
      status,
      month: `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`,
      completedAt,
      score
    });
  }
  return tasks;
}

const mockTasks = generateMockTasks();

const trainingMaterials = [
  {
    id: 1,
    title: '新员工入职培训',
    category: '入职培训',
    duration: '45分钟',
    level: '初级',
    description: '了解公司文化、规章制度和工作流程',
    cover: 'training',
    createdAt: '2026-01-15',
    viewCount: 1256,
    progress: 100
  },
  {
    id: 2,
    title: '配送服务标准流程',
    category: '业务培训',
    duration: '30分钟',
    level: '初级',
    description: '掌握配送任务的执行标准和客户沟通技巧',
    cover: 'delivery',
    createdAt: '2026-02-20',
    viewCount: 892,
    progress: 100
  },
  {
    id: 3,
    title: '产品安装操作指南',
    category: '技能培训',
    duration: '60分钟',
    level: '中级',
    description: '学习各类产品的安装步骤和注意事项',
    cover: 'install',
    createdAt: '2026-03-10',
    viewCount: 678,
    progress: 60
  },
  {
    id: 4,
    title: '客户服务沟通技巧',
    category: '服务培训',
    duration: '40分钟',
    level: '中级',
    description: '提升客户投诉处理和满意度提升方法',
    cover: 'service',
    createdAt: '2026-04-05',
    viewCount: 1103,
    progress: 30
  },
  {
    id: 5,
    title: '安全操作规范',
    category: '安全培训',
    duration: '35分钟',
    level: '必修',
    description: '工作中的安全操作和应急处理流程',
    cover: 'safety',
    createdAt: '2026-05-12',
    viewCount: 2341,
    progress: 0
  },
  {
    id: 6,
    title: '高效时间管理',
    category: '职业发展',
    duration: '50分钟',
    level: '高级',
    description: '提升工作效率的时间管理方法',
    cover: 'efficiency',
    createdAt: '2026-06-01',
    viewCount: 456,
    progress: 0
  }
];

module.exports = {
  employees,
  mockTasks,
  trainingMaterials,
  taskTypes,
  statuses,
  statusLabels
};
