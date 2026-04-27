import { createClient } from '@/lib/supabase-server'
import type { Category } from '@/types'

/** Повертає всі категорії тренувань, відсортовані за полем order. */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order')

  if (error) throw error
  return data
}
