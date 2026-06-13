// Pattern: Repository — ізолює всі запити до user_day_progress від решти коду
import { createClient } from '@/lib/supabase-server'
import { cache } from 'react'
import type { Day, DayWithWeek, DayFullContext } from '@/types'

/** Позначає день як виконаний. Ігнорує дублікат (якщо вже відмічено). */
export async function markDayComplete(userId: string, dayId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('user_day_progress')
    .upsert({ user_id: userId, day_id: dayId }, { onConflict: 'user_id,day_id' })

  if (error) throw error
}

/** Перевіряє, чи день вже виконаний користувачем. */
export async function isDayComplete(userId: string, dayId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_day_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('day_id', dayId)
    .single()

  return !!data
}

/** Повертає set із id виконаних днів користувача для конкретної програми. */
export const getCompletedDayIds = cache(async (userId: string, programId: string): Promise<Set<string>> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_day_progress')
    .select('day_id, days!inner(week_id, weeks!inner(program_id))')
    .eq('user_id', userId)
    .eq('days.weeks.program_id', programId)

  if (error) throw error
  return new Set((data ?? []).map(r => r.day_id))
})

/**
 * Повертає наступний невиконаний день у програмі з даними тижня (для Home screen).
 * Якщо всі дні виконані — повертає null.
 */
export async function getNextDay(userId: string, programId: string): Promise<DayWithWeek | null> {
  const supabase = await createClient()

  const completedIds = await getCompletedDayIds(userId, programId)

  const query = supabase
    .from('days')
    .select('*, weeks!inner(program_id, order, title_ua, title_en)')
    .eq('weeks.program_id', programId)
    .order('order', { referencedTable: 'weeks', ascending: true })
    .order('order', { ascending: true })

  if (completedIds.size > 0) {
    query.not('id', 'in', `(${[...completedIds].join(',')})`)
  }

  const { data, error } = await query.limit(1).single()

  if (error?.code === 'PGRST116') return null  // не знайдено — всі виконані
  if (error) throw error
  return data as DayWithWeek
}

/** Повертає загальну кількість днів у програмі. Використовується для відображення прогресу "N з M". */
export async function getTotalDaysInProgram(programId: string): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('days')
    .select('id, weeks!inner(program_id)', { count: 'exact', head: true })
    .eq('weeks.program_id', programId)

  if (error) throw error
  return count ?? 0
}

/** Повертає день за людським шляхом (program slug + week order + day order). */
export async function getDayByPath(
  slug: string,
  weekOrder: number,
  dayOrder: number,
): Promise<DayFullContext | null> {
  const supabase = await createClient()
  // `order` — зарезервоване слово в PostgREST, тому фільтруємо order вже в JS.
  const { data, error } = await supabase
    .from('days')
    .select('*, weeks!inner(order, title_ua, title_en, programs!inner(id, slug, title_ua, title_en))')
    .eq('weeks.programs.slug', slug)

  if (error) throw error
  const day = (data ?? []).find(
    d => d.order === dayOrder && (d.weeks as unknown as { order: number }).order === weekOrder,
  )
  return (day as unknown as DayFullContext) ?? null
}

/** Повертає повний контекст дня за id (day + week + program). */
export async function getDayContext(dayId: string): Promise<DayFullContext | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('days')
    .select('*, weeks!inner(order, title_ua, title_en, programs!inner(id, slug, title_ua, title_en))')
    .eq('id', dayId)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return (data as unknown as DayFullContext) ?? null
}

/** Повертає дати (ISO-рядки) всіх виконаних днів користувача, відсортованих від новішого. */
export async function getCompletedDates(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_day_progress')
    .select('completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(r => r.completed_at)
}

/** Повертає Set program_id програм де юзер виконав хоча б один день сьогодні. */
export async function getDoneProgramIdsToday(userId: string): Promise<Set<string>> {
  const supabase = await createClient()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('user_day_progress')
    .select('day_id, days!inner(week_id, weeks!inner(program_id))')
    .eq('user_id', userId)
    .gte('completed_at', todayStart.toISOString())

  if (error) throw error
  return new Set(
    (data ?? []).map(r => (r.days as unknown as { weeks: { program_id: string } }).weeks.program_id)
  )
}
