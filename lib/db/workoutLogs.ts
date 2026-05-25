// Pattern: Repository — ізолює всі запити до workout_logs від решти коду
import { createClient } from '@/lib/supabase-server'
import type { WorkoutLog, WorkoutLogWithExercise } from '@/types'

const DAY_MS = 86_400_000

/** Повертає загальну статистику для дашборду: кількість тренувальних днів, середній hold і середні повторення. */
export async function getDashboardStats(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('workout_logs')
    .select('reps_sets, hold_sets, logged_at')
    .eq('user_id', userId)

  if (!data?.length) return { totalSessions: 0, avgHold: 0, avgReps: 0 }

  const avg = (nums: number[]) =>
    nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0

  const allHolds = data.flatMap(r => r.hold_sets ?? [])
  const allReps = data.flatMap(r => r.reps_sets ?? [])

  return {
    totalSessions: new Set(data.map(r => r.logged_at.slice(0, 10))).size,
    avgHold: avg(allHolds),
    avgReps: avg(allReps),
  }
}

/** Повертає дані для графіку конкретної вправи: середнє значення (hold або reps) по кожному дню за вказану кількість днів. */
export async function getChartData(userId: string, exerciseId: string, days = 30): Promise<{ date: string; value: number }[]> {
  const since = new Date(Date.now() - days * DAY_MS).toISOString()
  const supabase = await createClient()
  const { data } = await supabase
    .from('workout_logs')
    .select('logged_at, hold_sets, reps_sets')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .gte('logged_at', since)
    .order('logged_at', { ascending: true })

  if (!data?.length) return []

  const grouped: Record<string, number[]> = {}
  for (const r of data) {
    const date = r.logged_at.slice(0, 10)
    grouped[date] ??= []
    if (r.hold_sets?.length) grouped[date].push(Math.max(...r.hold_sets))
    else if (r.reps_sets?.length) grouped[date].push(Math.round(r.reps_sets.reduce((a: number, b: number) => a + b, 0) / r.reps_sets.length))
  }

  const avg = (nums: number[]) => Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
  return Object.entries(grouped).map(([date, values]) => ({ date, value: avg(values) }))
}

/** Повертає всі записи тренувань користувача з назвами вправ, відсортовані від найновішого. */
export async function getLogsByUser(userId: string): Promise<WorkoutLogWithExercise[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*, exercises(name_ua, name_en, is_handstand, days(weeks(programs(title_ua, title_en))))')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })

  if (error) throw error
  return data as WorkoutLogWithExercise[]
}

/** Повертає всі записи конкретної вправи для користувача, відсортовані від найстарішого (для графіку). */
export async function getLogsByExercise(userId: string, exerciseId: string): Promise<WorkoutLog[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .order('logged_at', { ascending: true })

  if (error) throw error
  return data
}

export type CreateLogInput = {
  exercise_id: string
  hold_sets?: number[]
  reps_sets?: number[]
  video_url?: string
  note?: string
}

/** Зберігає результат тренування у БД. Бізнес-логіка (авто-відмітка дня) — в lib/services/training.ts. */
export async function createLog(userId: string, input: CreateLogInput): Promise<WorkoutLog> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export type UpdateLogInput = {
  hold_sets?: number[]
  reps_sets?: number[]
  note?: string | null
  video_url?: string | null
}

/** Оновлює запис тренування. Перевіряє що запис належить userId. */
export async function updateLog(logId: string, userId: string, input: UpdateLogInput): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('workout_logs')
    .update(input)
    .eq('id', logId)
    .eq('user_id', userId)  // security: тільки свої записи

  if (error) throw error
}

/** Повертає exercise_id логів вказаних вправ, залогованих після вказаного часу (ISO-рядок). */
export async function getLogsByExercisesToday(
  userId: string,
  exerciseIds: string[],
  since: string,
): Promise<{ exercise_id: string }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .select('exercise_id')
    .eq('user_id', userId)
    .in('exercise_id', exerciseIds)
    .gte('logged_at', since)

  if (error) throw error
  return data ?? []
}

/** Повертає exercise_id і hold_sets логів вказаних вправ за сьогодні. Використовується для статистики на completion-екрані. */
export async function getLogsSummaryToday(
  userId: string,
  exerciseIds: string[],
  since: string,
): Promise<{ exercise_id: string; hold_sets: number[] | null }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .select('exercise_id, hold_sets')
    .eq('user_id', userId)
    .in('exercise_id', exerciseIds)
    .gte('logged_at', since)

  if (error) throw error
  return data ?? []
}
