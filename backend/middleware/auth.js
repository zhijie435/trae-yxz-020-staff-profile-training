const { employees } = require('../data/mockData');

const activeTokens = new Map();

function generateToken() {
  return require('crypto').randomBytes(32).toString('hex');
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.headers['x-token'];

  if (!token) {
    return res.status(401).json({ code: -1, message: '未登录，请先登录' });
  }

  const employeeId = activeTokens.get(token);
  if (!employeeId) {
    return res.status(401).json({ code: -1, message: '登录已过期，请重新登录' });
  }

  const employee = employees.find(e => e.employeeId === employeeId);
  if (!employee) {
    return res.status(401).json({ code: -1, message: '用户不存在' });
  }

  req.employee = employee;
  req.token = token;
  next();
}

function invalidateEmployeeTokens(employeeId) {
  for (const [token, eid] of activeTokens.entries()) {
    if (eid === employeeId) {
      activeTokens.delete(token);
    }
  }
}

module.exports = {
  activeTokens,
  generateToken,
  authenticateToken,
  invalidateEmployeeTokens
};
