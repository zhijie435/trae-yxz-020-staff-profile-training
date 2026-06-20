const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const employees = [
  {
    id: 1,
    name: '张三',
    employeeId: 'EMP001',
    completedTasks: 156,
    monthlyCompletedTasks: 24,
    deliveryRate: 96.5,
    satisfactionRate: 98.2
  },
  {
    id: 2,
    name: '李四',
    employeeId: 'EMP002',
    completedTasks: 89,
    monthlyCompletedTasks: 18,
    deliveryRate: 92.3,
    satisfactionRate: 95.8
  },
  {
    id: 3,
    name: '王五',
    employeeId: 'EMP003',
    completedTasks: 234,
    monthlyCompletedTasks: 32,
    deliveryRate: 98.7,
    satisfactionRate: 99.1
  }
];

app.get('/api/employee/profile', (req, res) => {
  const employee = employees[0];

  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
  const cancelledTasks = mockTasks.filter(t => t.status === 'cancelled').length;
  const totalValidTasks = mockTasks.length - cancelledTasks;
  const deliveryRate = totalValidTasks > 0
    ? parseFloat(((completedTasks / totalValidTasks) * 100).toFixed(1))
    : 0;

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyCompletedTasks = mockTasks.filter(
    t => t.status === 'completed' && t.month === currentMonth
  ).length;

  const completedWithScore = mockTasks.filter(t => t.status === 'completed' && t.score !== null);
  const highScoreTasks = completedWithScore.filter(t => t.score >= 80);
  const satisfactionRate = completedWithScore.length > 0
    ? parseFloat(((highScoreTasks.length / completedWithScore.length) * 100).toFixed(1))
    : 0;

  res.json({
    code: 0,
    message: 'success',
    data: {
      name: employee.name,
      employeeId: employee.employeeId,
      completedTasks,
      monthlyCompletedTasks,
      deliveryRate,
      satisfactionRate
    }
  });
});

app.get('/api/employee/:id', (req, res) => {
  const employeeId = parseInt(req.params.id);
  const employee = employees.find(e => e.id === employeeId);
  
  if (!employee) {
    return res.status(404).json({ message: '员工不存在' });
  }
  
  res.json({
    name: employee.name,
    employeeId: employee.employeeId,
    completedTasks: employee.completedTasks
  });
});

app.get('/api/employee', (req, res) => {
  const employee = employees[0];
  res.json({
    name: employee.name,
    employeeId: employee.employeeId,
    completedTasks: employee.completedTasks
  });
});

app.post('/api/employee/logout', (req, res) => {
  res.json({ code: 0, message: 'success' });
});

app.post('/api/employee/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.json({ code: -1, message: '请填写所有密码字段' });
  }
  if (newPassword.length < 6) {
    return res.json({ code: -1, message: '新密码长度至少6位' });
  }
  if (oldPassword !== '123456') {
    return res.json({ code: -1, message: '当前密码不正确' });
  }
  res.json({ code: 0, message: 'success' });
});

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

app.get('/api/employee/tasks', (req, res) => {
  const { month, type, status } = req.query;
  let filtered = [...mockTasks];
  if (month) {
    filtered = filtered.filter(t => t.month === month);
  }
  if (type) {
    filtered = filtered.filter(t => t.type === type);
  }
  if (status) {
    filtered = filtered.filter(t => t.status === status);
  }
  filtered.sort((a, b) => b.id - a.id);
  res.json({
    code: 0,
    message: 'success',
    data: {
      list: filtered,
      total: filtered.length
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
