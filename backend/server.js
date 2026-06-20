const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const taskRoutes = require('./routes/tasks');
const trainingRoutes = require('./routes/training');
const securityRoutes = require('./routes/security');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/employee', authRoutes);
app.use('/api/employee/tasks', taskRoutes);
app.use('/api/employee/training', trainingRoutes);
app.use('/api/employee/security', securityRoutes);
app.use('/api/employee', employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
