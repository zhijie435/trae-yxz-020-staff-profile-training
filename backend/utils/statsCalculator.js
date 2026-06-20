function calculateEmployeeStats(tasks) {
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const cancelledTasks = tasks.filter(t => t.status === 'cancelled').length;
  const totalValidTasks = tasks.length - cancelledTasks;
  const deliveryRate = totalValidTasks > 0
    ? parseFloat(((completedTasks / totalValidTasks) * 100).toFixed(1))
    : 0;

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyCompletedTasks = tasks.filter(
    t => t.status === 'completed' && t.month === currentMonth
  ).length;

  const completedWithScore = tasks.filter(t => t.status === 'completed' && t.score !== null);
  const highScoreTasks = completedWithScore.filter(t => t.score >= 80);
  const satisfactionRate = completedWithScore.length > 0
    ? parseFloat(((highScoreTasks.length / completedWithScore.length) * 100).toFixed(1))
    : 0;

  return {
    completedTasks,
    cancelledTasks,
    totalValidTasks,
    deliveryRate,
    currentMonth,
    monthlyCompletedTasks,
    satisfactionRate
  };
}

module.exports = {
  calculateEmployeeStats
};
