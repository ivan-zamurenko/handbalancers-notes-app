import { createClient } from '@/lib/supabase-server'
import type { WorkoutLog } from '@/types'

const DAY_MS = 86_400_000

/** Повертає загальну статистику для дашборду: кількість тренувальних днів, середній hold і середні повторення. */
export async function getDashboardStats(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('workout_logs')
    .select('reps, achieved_hold, logged_at')
    .eq('user_id', userId)

  if (!data?.length) return { totalSessions: 0, avgHold: 0, avgReps: 0 }

  const avg = (nums: number[]) =>
    nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0

  return {
    totalSessions: new Set(data.map(r => r.logged_at.slice(0, 10))).size,
    avgHold: avg(data.filter(r => r.achieved_hold).map(r => r.achieved_hold!)),
    avgReps: avg(data.filter(r => r.reps).map(r => r.reps!)),
  }
}

/** Повертає дані для графіку конкретної вправи: середнє значення (hold або reps) по кожному дню за вказану кількість днів. */
export async function getChartData(userId: string, exerciseId: string, days = 30): Promise<{ date: string; value: number }[]> {
  const since = new Date(Date.now() - days * DAY_MS).toISOString()
  const supabase = await createClient()
  const { data } = await supabase
    .from('workout_logs')
    .select('logged_at, achieved_hold, reps')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .gte('logged_at', since)
    .order('logged_at', { ascending: true })

  if (!data?.length) return []

  const grouped: Record<string, number[]> = {}
  for (const r of data) {
    const date = r.logged_at.slice(0, 10)
    grouped[date] ??= []
    grouped[date].push(r.achieved_hold ?? r.reps ?? 0)
  }

  const avg = (nums: number[]) => Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
  return Object.entries(grouped).map(([date, values]) => ({ date, value: avg(values) }))
}

/** Повертає всі записи тренувань користувача, відсортовані від найновішого. */
export async function getLogsByUser(userId: string): Promise<WorkoutLog[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })

  if (error) throw error
  return data
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
  sets?: number
  reps?: number
  achieved_hold?: number
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
