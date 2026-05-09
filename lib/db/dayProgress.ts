// Pattern: Repository — ізолює всі запити до user_day_progress від решти коду
import { createClient } from '@/lib/supabase-server'
import type { Day } from '@/types'

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
export async function getCompletedDayIds(userId: string, programId: string): Promise<Set<string>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_day_progress')
    .select('day_id, days!inner(week_id, weeks!inner(program_id))')
    .eq('user_id', userId)
    .eq('days.weeks.program_id', programId)

  if (error) throw error
  return new Set((data ?? []).map(r => r.day_id))
}

/**
 * Повертає наступний невиконаний день у програмі (за порядком тижнів і днів).
 * Якщо всі дні виконані — повертає null.
 */
export async function getNextDay(userId: string, programId: string): Promise<Day | null> {
  const supabase = await createClient()

  const completedIds = await getCompletedDayIds(userId, programId)

  const query = supabase
    .from('days')
    .select('*, weeks!inner(program_id, order)')
    .eq('weeks.program_id', programId)
    .order('order', { referencedTable: 'weeks', ascending: true })
    .order('order', { ascending: true })

  if (completedIds.size > 0) {
    query.not('id', 'in', `(${[...completedIds].join(',')})`)
  }

  const { data, error } = await query.limit(1).single()

  if (error?.code === 'PGRST116') return null  // не знайдено — всі виконані
  if (error) throw error
  return data as Day
}
