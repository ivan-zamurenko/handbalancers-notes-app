// Pattern: Service Layer — бізнес-логіка тренувань (streak, авто-відмітка дня)
// Використовує Repository (lib/db/) для доступу до даних
import { createLog, getLogsByExercisesToday, getLogsSummaryToday, getPersonalBest, type CreateLogInput } from '@/lib/db/workoutLogs'
import { getCompletedDates, markDayComplete } from '@/lib/db/dayProgress'
import { getExerciseById, getExercisesByDay } from '@/lib/db/exercises'
import type { WorkoutLog } from '@/types'
import { DAY_MS } from '@/lib/constants'

/**
 * Повертає кількість підряд ідучих днів, у які юзер завершив хоча б один день програми (streak).
 * Рахується по таблиці user_day_progress.
 */
export async function getStreak(userId: string): Promise<number> {
  const rawDates = await getCompletedDates(userId)
  if (!rawDates.length) return 0

  const dates = [...new Set(rawDates.map(d => d.slice(0, 10)))]
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10)

  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) / DAY_MS
    if (diff === 1) streak++
    else break
  }
  return streak
}

/**
 * Зберігає результат тренування.
 * Якщо всі вправи дня залоговані сьогодні — автоматично відмічає день як виконаний.
 * Повертає { log, isNewRecord } — true якщо побитий особистий рекорд.
 */
export async function saveExerciseLog(userId: string, input: CreateLogInput): Promise<{ log: WorkoutLog; isNewRecord: boolean }> {
  // Отримуємо PR до збереження, щоб коректно порівняти
  const { bestHold, bestReps } = await getPersonalBest(userId, input.exercise_id)

  const log = await createLog(userId, input)

  // Визначаємо: чи побитий рекорд?
  let isNewRecord = false
  if (input.hold_sets?.length) {
    const newBest = Math.max(...input.hold_sets)
    isNewRecord = bestHold === null || newBest > bestHold
  } else if (input.reps_sets?.length) {
    const newBest = Math.max(...input.reps_sets)
    isNewRecord = bestReps === null || newBest > bestReps
  }

  const exercise = await getExerciseById(input.exercise_id)
  if (!exercise?.day_id) return { log, isNewRecord }

  const allExercises = await getExercisesByDay(exercise.day_id)
  if (!allExercises.length) return { log, isNewRecord }

  const exerciseIds = allExercises.map(e => e.id)
  const since = new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z'
  const todayLogs = await getLogsByExercisesToday(userId, exerciseIds, since)

  const loggedIds = new Set(todayLogs.map(l => l.exercise_id))
  const allDone = exerciseIds.every(id => loggedIds.has(id))
  if (allDone) await markDayComplete(userId, exercise.day_id)

  return { log, isNewRecord }
}

/**
 * Повертає статистику виконання дня: кількість залогованих вправ і загальний час hold за сьогодні.
 * Використовується на completion-екрані.
 */
export async function getDayCompletionStats(userId: string, dayId: string): Promise<{ exercisesLogged: number; totalHoldSec: number }> {
  const allExercises = await getExercisesByDay(dayId)
  if (!allExercises.length) return { exercisesLogged: 0, totalHoldSec: 0 }

  const exerciseIds = allExercises.map(e => e.id)
  const since = new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z'
  const logs = await getLogsSummaryToday(userId, exerciseIds, since)

  const exercisesLogged = new Set(logs.map(l => l.exercise_id)).size
  const totalHoldSec = logs.flatMap(l => l.hold_sets ?? []).reduce((sum, s) => sum + s, 0)

  return { exercisesLogged, totalHoldSec }
}
