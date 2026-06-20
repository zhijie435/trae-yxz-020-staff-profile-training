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
  res.json({
    code: 0,
    message: 'success',
    data: {
      name: employee.name,
      employeeId: employee.employeeId,
      completedTasks: employee.completedTasks,
      monthlyCompletedTasks: employee.monthlyCompletedTasks,
      deliveryRate: employee.deliveryRate,
      satisfactionRate: employee.satisfactionRate
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
