import { createClient } from '@/lib/supabase-server'
import type { Exercise } from '@/types'

/** Повертає список вправ, які користувач позначив зірочкою (для відстеження на дашборді). */
export async function getFavoriteExercises(userId: string): Promise<Exercise[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_exercise_favorites')
    .select('exercise_id, exercises(*)')
    .eq('user_id', userId)

  if (error) throw error
  return data.map(r => r.exercises as Exercise)
}

/** Додає або видаляє вправу з обраних (toggle). Повертає новий стан: true = додано. */
export async function toggleFavorite(userId: string, exerciseId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('user_exercise_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .single()

  if (existing) {
    await supabase
      .from('user_exercise_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
    return false
  }

  await supabase
    .from('user_exercise_favorites')
    .insert({ user_id: userId, exercise_id: exerciseId })
  return true
}
