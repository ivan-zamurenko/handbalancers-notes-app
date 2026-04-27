import { createClient } from '@/lib/supabase-server'
import type { Exercise } from '@/types'

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
