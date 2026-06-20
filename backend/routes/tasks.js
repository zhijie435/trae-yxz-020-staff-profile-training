const express = require('express');
const { mockTasks } = require('../data/mockData');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
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

router.get('/summary', authenticateToken, (req, res) => {
  const { month } = req.query;
  let tasks = [...mockTasks];

  if (month) {
    tasks = tasks.filter(t => t.month === month);
  }

  const summary = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    cancelled: tasks.filter(t => t.status === 'cancelled').length,
    avgScore: 0
  };

  const completedWithScore = tasks.filter(t => t.status === 'completed' && t.score !== null);
  if (completedWithScore.length > 0) {
    const totalScore = completedWithScore.reduce((sum, t) => sum + t.score, 0);
    summary.avgScore = parseFloat((totalScore / completedWithScore.length).toFixed(1));
  }

  res.json({
    code: 0,
    message: 'success',
    data: summary
  });
});

module.exports = router;
