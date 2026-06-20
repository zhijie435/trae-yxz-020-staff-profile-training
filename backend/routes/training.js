const express = require('express');
const { trainingMaterials } = require('../data/mockData');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const { category, level } = req.query;
  let filtered = [...trainingMaterials];

  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }
  if (level) {
    filtered = filtered.filter(t => t.level === level);
  }

  res.json({
    code: 0,
    message: 'success',
    data: {
      list: filtered,
      total: filtered.length
    }
  });
});

router.get('/categories', authenticateToken, (req, res) => {
  const categories = [...new Set(trainingMaterials.map(t => t.category))];
  const levels = [...new Set(trainingMaterials.map(t => t.level))];

  res.json({
    code: 0,
    message: 'success',
    data: {
      categories,
      levels
    }
  });
});

router.get('/stats', authenticateToken, (req, res) => {
  const total = trainingMaterials.length;
  const completed = trainingMaterials.filter(t => t.progress === 100).length;
  const inProgress = trainingMaterials.filter(t => t.progress > 0 && t.progress < 100).length;
  const notStarted = trainingMaterials.filter(t => t.progress === 0).length;

  const totalProgress = total > 0
    ? parseFloat((trainingMaterials.reduce((sum, t) => sum + t.progress, 0) / total).toFixed(1))
    : 0;

  res.json({
    code: 0,
    message: 'success',
    data: {
      total,
      completed,
      inProgress,
      notStarted,
      totalProgress
    }
  });
});

router.get('/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const material = trainingMaterials.find(t => t.id === id);

  if (!material) {
    return res.status(404).json({ code: -1, message: '培训资料不存在' });
  }

  material.viewCount += 1;

  res.json({
    code: 0,
    message: 'success',
    data: material
  });
});

router.post('/:id/progress', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { progress } = req.body;
  const material = trainingMaterials.find(t => t.id === id);

  if (!material) {
    return res.status(404).json({ code: -1, message: '培训资料不存在' });
  }

  if (progress === undefined || progress < 0 || progress > 100) {
    return res.json({ code: -1, message: '进度值无效，必须在 0-100 之间' });
  }

  material.progress = progress;

  res.json({
    code: 0,
    message: 'success',
    data: {
      id: material.id,
      progress: material.progress
    }
  });
});

module.exports = router;
