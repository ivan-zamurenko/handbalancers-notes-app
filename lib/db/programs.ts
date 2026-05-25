// Pattern: Repository — ізолює всі запити до programs/weeks/days від решти коду
import { createClient } from '@/lib/supabase-server'
import type { Program, Week, Day } from '@/types'

/** Повертає всі програми, відсортовані за категорією і полем order. */
export async function getAllPrograms(): Promise<Program[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('order')

  if (error) throw error
  return data
}

/** Повертає всі програми в межах категорії, відсортовані за полем order. */
export async function getProgramsByCategory(categoryId: string): Promise<Program[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('category_id', categoryId)
    .order('order')

  if (error) throw error
  return data
}

/** Повертає програму за ID або null якщо не знайдено. */
export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

/** Повертає програму за slug або null якщо не знайдено. */
export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error?.code === 'PGRST116') return null  // рядок не знайдено
  if (error) throw error                        // будь-яка інша помилка — видима
  return data
}

/** Перевіряє чи користувач вже записаний на програму. */
export async function isEnrolled(userId: string, programId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_programs')
    .select('id')
    .eq('user_id', userId)
    .eq('program_id', programId)
    .single()

  return !!data
}

/** Записує користувача на програму. Зберігає start_date при першому записі (упсерт idempotent). */
export async function enrollProgram(userId: string, programId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('user_programs')
    .upsert(
      { user_id: userId, program_id: programId, start_date: new Date().toISOString() },
      { onConflict: 'user_id,program_id', ignoreDuplicates: true },  // не перезаписує start_date якщо вже є
    )

  if (error) throw error
}

/**
 * Повертає найновішу активну програму користувача (найостання за датою запису).
 * Використовується на Home screen для блоку "Сьогодні".
 */
export async function getActiveEnrollment(userId: string): Promise<{ program: Program; startDate: string } | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_programs')
    .select('start_date, programs(*)')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })
    .limit(1)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return { program: data.programs as unknown as Program, startDate: data.start_date }
}

/** Повертає всі активні програми користувача (для дашборду з кількома програмами). */
export async function getAllEnrollments(userId: string): Promise<{ program: Program; startDate: string }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_programs')
    .select('start_date, programs(*)')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })

  if (error) throw error
  return (data ?? []).map(row => ({
    program: row.programs as unknown as Program,
    startDate: row.start_date,
  }))
}

/** Повертає всі тижні програми, відсортовані за полем order. */
export async function getWeeksByProgram(programId: string): Promise<Week[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('program_id', programId)
    .order('order')

  if (error) throw error
  return data
}

/** Повертає всі дні тижня, відсортовані за полем order. */
export async function getDaysByWeek(weekId: string): Promise<Day[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('days')
    .select('*')
    .eq('week_id', weekId)
    .order('order')

  if (error) throw error
  return data
}
