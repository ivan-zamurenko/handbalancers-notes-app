// Pattern: Repository — ізолює всі запити до exercises від решти коду
import { createClient } from '@/lib/supabase-server'
import type { Exercise } from '@/types'

/** Повертає всі вправи дня, відсортовані за полем order. */
export async function getExercisesByDay(dayId: string): Promise<Exercise[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('day_id', dayId)
    .order('order')

  if (error) throw error
  return data
}

/** Повертає кількість вправ у дні. */
export async function getExerciseCount(dayId: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('exercises')
    .select('*', { count: 'exact', head: true })
    .eq('day_id', dayId)

  return count ?? 0
}

/** Повертає вправу за ID або null якщо не знайдено. */
export async function getExerciseById(id: string): Promise<Exercise | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}
