// Pattern: Service Layer — бізнес-логіка тренувань (streak, авто-відмітка дня)
// Використовує Repository (lib/db/) для доступу до даних
import { createLog, getLogsByExercisesToday, type CreateLogInput } from '@/lib/db/workoutLogs'
import { getCompletedDates, markDayComplete } from '@/lib/db/dayProgress'
import { getExerciseById, getExercisesByDay } from '@/lib/db/exercises'
import type { WorkoutLog } from '@/types'

const DAY_MS = 86_400_000

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
 */
export async function saveExerciseLog(userId: string, input: CreateLogInput): Promise<WorkoutLog> {
  const log = await createLog(userId, input)

  const exercise = await getExerciseById(input.exercise_id)
  if (!exercise?.day_id) return log

  const allExercises = await getExercisesByDay(exercise.day_id)
  if (!allExercises.length) return log

  const exerciseIds = allExercises.map(e => e.id)
  const since = new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z'
  const todayLogs = await getLogsByExercisesToday(userId, exerciseIds, since)

  const loggedIds = new Set(todayLogs.map(l => l.exercise_id))
  const allDone = exerciseIds.every(id => loggedIds.has(id))
  if (allDone) await markDayComplete(userId, exercise.day_id)

  return log
}
