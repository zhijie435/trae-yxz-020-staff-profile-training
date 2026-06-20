const express = require('express');
const { authenticateToken, invalidateEmployeeTokens } = require('../middleware/auth');

const router = express.Router();

router.post('/change-password', authenticateToken, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const employee = req.employee;

  if (!oldPassword || !newPassword) {
    return res.json({ code: -1, message: '请填写所有密码字段' });
  }
  if (newPassword.length < 6) {
    return res.json({ code: -1, message: '新密码长度至少6位' });
  }
  if (oldPassword !== employee.password) {
    return res.json({ code: -1, message: '当前密码不正确' });
  }

  employee.password = newPassword;
  invalidateEmployeeTokens(employee.employeeId);

  res.json({ code: 0, message: '密码修改成功，请重新登录' });
});

router.get('/settings', authenticateToken, (req, res) => {
  const employee = req.employee;

  res.json({
    code: 0,
    message: 'success',
    data: {
      employeeId: employee.employeeId,
      name: employee.name,
      hasPassword: !!employee.password,
      lastPasswordChange: '2026-05-01',
      loginDevices: [
        {
          id: 1,
          name: 'iPhone 14',
          type: 'mobile',
          lastLogin: '2026-06-18 14:30',
          current: true
        },
        {
          id: 2,
          name: 'MacBook Pro',
          type: 'desktop',
          lastLogin: '2026-06-15 09:00',
          current: false
        }
      ]
    }
  });
});

router.post('/logout-device', authenticateToken, (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    return res.json({ code: -1, message: '设备ID不能为空' });
  }

  res.json({
    code: 0,
    message: '设备已退出登录'
  });
});

module.exports = router;
