// Pattern: Facade
// Єдина точка доступу до data-операцій для app/components/api шарів.
export { getCategories } from '@/lib/db/categories'
export {
  getAllPrograms,
  getAllEnrollments,
  getCompletedProgramIds,
  getProgramBySlug,
  getWeeksByProgram,
  getDaysByWeek,
  isEnrolled,
  enrollProgram,
} from '@/lib/db/programs'
export { getExercisesByDay } from '@/lib/db/exercises'
export { getFavoriteExercises, toggleFavorite } from '@/lib/db/favorites'
export { getNextDay, getCompletedDayIds, getDayByPath, getDayContext, getDoneProgramIdsToday, getTotalDaysInProgram } from '@/lib/db/dayProgress'
export { getLogsByUser, getChartData, getHandstandChartData, updateLog, getRadarData, getDashboardStats } from '@/lib/db/workoutLogs'
export type { CreateLogInput, UpdateLogInput, RadarDataPoint } from '@/lib/db/workoutLogs'
