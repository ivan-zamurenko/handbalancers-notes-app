'use server'
// Pattern: Service Layer — Server Actions як точка входу для мутацій
import { createClient } from '@/lib/supabase-server'
import { saveExerciseLog } from '@/lib/services/training'
import { toggleFavorite } from '@/lib/db/favorites'
import type { CreateLogInput } from '@/lib/db/workoutLogs'

/** Зберігає результат вправи. userId береться з сесії — клієнту не довіряємо. */
export async function saveLog(input: Omit<CreateLogInput, 'user_id'>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  await saveExerciseLog(user.id, input)
}

/** Перемикає стан улюбленої вправи. Повертає новий стан: true = додано. */
export async function toggleFavoriteAction(exerciseId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return toggleFavorite(user.id, exerciseId)
}
