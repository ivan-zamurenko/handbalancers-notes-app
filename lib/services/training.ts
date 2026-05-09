import { createClient } from '@/lib/supabase-server'
import { createLog, type CreateLogInput } from '@/lib/db/workoutLogs'
import { markDayComplete } from '@/lib/db/dayProgress'
import type { WorkoutLog } from '@/types'

const DAY_MS = 86_400_000

/**
 * Повертає кількість підряд ідучих днів, у які юзер завершив хоча б один день програми (streak).
 * Рахується по таблиці user_day_progress.
 */
export async function getStreak(userId: string): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_day_progress')
    .select('completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (!data?.length) return 0

  const dates = [...new Set(data.map(r => r.completed_at.slice(0, 10)))]
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

  const supabase = await createClient()
  const { data: exercise } = await supabase
    .from('exercises')
    .select('day_id')
    .eq('id', input.exercise_id)
    .single()

  if (exercise?.day_id) {
    const { data: allExercises } = await supabase
      .from('exercises')
      .select('id')
      .eq('day_id', exercise.day_id)

    if (allExercises?.length) {
      const exerciseIds = allExercises.map(e => e.id)
      const todayStart = new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z'

      const { data: logs } = await supabase
        .from('workout_logs')
        .select('exercise_id')
        .eq('user_id', userId)
        .in('exercise_id', exerciseIds)
        .gte('logged_at', todayStart)

      const loggedIds = new Set(logs?.map(l => l.exercise_id))
      const allDone = exerciseIds.every(id => loggedIds.has(id))
      if (allDone) await markDayComplete(userId, exercise.day_id)
    }
  }

  return log
}
