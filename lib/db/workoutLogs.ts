// Pattern: Repository — ізолює всі запити до workout_logs від решти коду
import { createClient } from '@/lib/supabase-server'
import type { WorkoutLog, WorkoutLogWithExercise } from '@/types'
import { DAY_MS } from '@/lib/constants'

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

/** Повертає дані для графіку "Handstand Hold": максимальний час утримання стійки за кожен день за останні N днів. */
export async function getHandstandChartData(userId: string, days = 60): Promise<{ date: string; value: number }[]> {
  const since = new Date(Date.now() - days * DAY_MS).toISOString()
  const supabase = await createClient()

  // Крок 1: знаходимо ID всіх handstand-вправ
  const { data: hsExercises } = await supabase
    .from('exercises')
    .select('id')
    .eq('is_handstand', true)

  const hsIds = hsExercises?.map(e => e.id) ?? []
  if (!hsIds.length) return []

  // Крок 2: тягнемо логи лише для цих вправ
  const { data } = await supabase
    .from('workout_logs')
    .select('logged_at, hold_sets')
    .eq('user_id', userId)
    .in('exercise_id', hsIds)
    .not('hold_sets', 'is', null)
    .gte('logged_at', since)
    .order('logged_at', { ascending: true })

  if (!data?.length) return []

  const grouped: Record<string, number[]> = {}
  for (const r of data) {
    if (!r.hold_sets?.length) continue
    const date = r.logged_at.slice(0, 10)
    grouped[date] ??= []
    grouped[date].push(Math.max(...r.hold_sets))
  }

  return Object.entries(grouped).map(([date, values]) => ({ date, value: Math.max(...values) }))
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
  let isHold = false
  for (const r of data) {
    const date = r.logged_at.slice(0, 10)
    grouped[date] ??= []
    if (r.hold_sets?.length) {
      isHold = true
      grouped[date].push(Math.max(...r.hold_sets))
    } else if (r.reps_sets?.length) {
      grouped[date].push(Math.round(r.reps_sets.reduce((a: number, b: number) => a + b, 0) / r.reps_sets.length))
    }
  }

  const aggregate = (nums: number[]) =>
    isHold ? Math.max(...nums) : Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
  return Object.entries(grouped).map(([date, values]) => ({ date, value: aggregate(values) }))
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

function normalizeVideoUrl(videoUrl?: string | null): string | null {
  if (!videoUrl?.trim()) return null

  const parsed = new URL(videoUrl.trim())
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Invalid video URL protocol')
  }

  return parsed.toString()
}

/** Зберігає результат тренування у БД. Бізнес-логіка (авто-відмітка дня) — в lib/services/training.ts. */
export async function createLog(userId: string, input: CreateLogInput): Promise<WorkoutLog> {
  const supabase = await createClient()
  const payload = {
    ...input,
    user_id: userId,
    video_url: normalizeVideoUrl(input.video_url),
  }

  const { data, error } = await supabase
    .from('workout_logs')
    .insert(payload)
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
  const payload = {
    ...input,
    video_url: normalizeVideoUrl(input.video_url),
  }

  const { error } = await supabase
    .from('workout_logs')
    .update(payload)
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

/**
 * Повертає особистий рекорд користувача для конкретної вправи.
 * Hold: максимальне утримання одного підходу за всю історію.
 * Reps: максимум повторень в одному підході за всю історію.
 */
export async function getPersonalBest(
  userId: string,
  exerciseId: string,
): Promise<{ bestHold: number | null; bestReps: number | null }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('workout_logs')
    .select('hold_sets, reps_sets')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)

  if (!data?.length) return { bestHold: null, bestReps: null }

  let bestHold: number | null = null
  let bestReps: number | null = null

  for (const row of data) {
    if (row.hold_sets?.length) {
      const m = Math.max(...row.hold_sets)
      if (bestHold === null || m > bestHold) bestHold = m
    }
    if (row.reps_sets?.length) {
      const m = Math.max(...row.reps_sets)
      if (bestReps === null || m > bestReps) bestReps = m
    }
  }

  return { bestHold, bestReps }
}

export type RadarDataPoint = {
  category: string   // slug категорії
  label_ua: string
  label_en: string
  count: number      // кількість залогованих вправ за 30 днів
}

/**
 * Повертає дані для radar chart: кількість залогованих вправ по категорії за останні 30 днів.
 * Кожна вправа рахується як 1 (підходи не рахуємо).
 */
export async function getRadarData(userId: string): Promise<RadarDataPoint[]> {
  const since = new Date(Date.now() - 30 * DAY_MS).toISOString()
  const supabase = await createClient()

  const { data } = await supabase
    .from('workout_logs')
    .select('exercises(exercise_category_id, categories!exercise_category_id(slug, title_ua, title_en))')
    .eq('user_id', userId)
    .gte('logged_at', since)

  if (!data?.length) return []

  const counts: Record<string, { label_ua: string; label_en: string; count: number }> = {}

  for (const row of data) {
    const ex = row.exercises as unknown as { exercise_category_id: string | null; categories: { slug: string; title_ua: string; title_en: string } | null } | null
    if (!ex?.categories || !ex.exercise_category_id) continue
    const { slug, title_ua, title_en } = ex.categories
    counts[slug] ??= { label_ua: title_ua, label_en: title_en, count: 0 }
    counts[slug].count++
  }

  return Object.entries(counts).map(([category, v]) => ({ category, ...v }))
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
