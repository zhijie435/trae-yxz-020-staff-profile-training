function calculateEmployeeStats(tasks, trainingMaterials = []) {
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

  let trainingCompletionRate = 0;
  let completedTrainingCount = 0;
  let totalTrainingCount = trainingMaterials.length;
  if (trainingMaterials.length > 0) {
    completedTrainingCount = trainingMaterials.filter(t => t.progress === 100).length;
    trainingCompletionRate = parseFloat(
      ((completedTrainingCount / trainingMaterials.length) * 100).toFixed(1)
    );
  }

  const avgTrainingProgress = totalTrainingCount > 0
    ? parseFloat(
        (trainingMaterials.reduce((sum, t) => sum + t.progress, 0) / totalTrainingCount).toFixed(1)
      )
    : 0;

  const inProgressTrainingCount = trainingMaterials.filter(
    t => t.progress > 0 && t.progress < 100
  ).length;
  const notStartedTrainingCount = trainingMaterials.filter(t => t.progress === 0).length;

  return {
    completedTasks,
    cancelledTasks,
    totalValidTasks,
    deliveryRate,
    currentMonth,
    monthlyCompletedTasks,
    satisfactionRate,
    trainingCompletionRate,
    completedTrainingCount,
    totalTrainingCount,
    avgTrainingProgress,
    inProgressTrainingCount,
    notStartedTrainingCount
  };
}

module.exports = {
  calculateEmployeeStats
};
