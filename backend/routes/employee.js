const express = require('express');
const { employees, mockTasks } = require('../data/mockData');
const { authenticateToken } = require('../middleware/auth');
const { calculateEmployeeStats } = require('../utils/statsCalculator');

const router = express.Router();

router.get('/profile', authenticateToken, (req, res) => {
  const employee = req.employee;
  const stats = calculateEmployeeStats(mockTasks);

  res.json({
    code: 0,
    message: 'success',
    data: {
      name: employee.name,
      employeeId: employee.employeeId,
      completedTasks: stats.completedTasks,
      monthlyCompletedTasks: stats.monthlyCompletedTasks,
      deliveryRate: stats.deliveryRate,
      satisfactionRate: stats.satisfactionRate
    }
  });
});

router.get('/stats', authenticateToken, (req, res) => {
  const stats = calculateEmployeeStats(mockTasks);

  res.json({
    code: 0,
    message: 'success',
    data: {
      completedTasks: stats.completedTasks,
      cancelledTasks: stats.cancelledTasks,
      totalValidTasks: stats.totalValidTasks,
      monthlyCompletedTasks: stats.monthlyCompletedTasks,
      deliveryRate: stats.deliveryRate,
      satisfactionRate: stats.satisfactionRate,
      currentMonth: stats.currentMonth
    }
  });
});

router.get('/', authenticateToken, (req, res) => {
  const employee = req.employee;
  res.json({
    name: employee.name,
    employeeId: employee.employeeId,
    completedTasks: employee.completedTasks
  });
});

router.get('/:id', authenticateToken, (req, res) => {
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

module.exports = router;
