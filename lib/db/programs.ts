import { createClient } from '@/lib/supabase-server'
import type { Program, Week, Day } from '@/types'

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
