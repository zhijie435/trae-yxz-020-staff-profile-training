const express = require('express');
const { employees } = require('../data/mockData');
const {
  activeTokens,
  generateToken,
  authenticateToken,
  invalidateEmployeeTokens
} = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.json({ code: -1, message: '请输入工号和密码' });
  }

  const employee = employees.find(e => e.employeeId === employeeId);
  if (!employee) {
    return res.json({ code: -1, message: '工号或密码错误' });
  }

  if (employee.password !== password) {
    return res.json({ code: -1, message: '工号或密码错误' });
  }

  const token = generateToken();
  activeTokens.set(token, employee.employeeId);

  res.json({
    code: 0,
    message: 'success',
    data: {
      token,
      employee: {
        id: employee.id,
        name: employee.name,
        employeeId: employee.employeeId
      }
    }
  });
});

router.post('/logout', authenticateToken, (req, res) => {
  activeTokens.delete(req.token);
  res.json({ code: 0, message: 'success' });
});

module.exports = router;
