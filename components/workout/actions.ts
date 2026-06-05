'use server'
// Pattern: Service Layer — Server Actions як точка входу для мутацій
import { getCurrentUser } from '@/lib/services/auth-service'
import { toggleFavorite, updateLog, type CreateLogInput, type UpdateLogInput } from '@/lib/services/data'
import { saveExerciseLog } from '@/lib/services/training'

/** Зберігає результат вправи. userId береться з сесії — клієнту не довіряємо. */
export async function saveLog(input: Omit<CreateLogInput, 'user_id'>): Promise<{ isNewRecord: boolean }> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  const { isNewRecord } = await saveExerciseLog(user.id, input)
  return { isNewRecord }
}

/** Оновлює існуючий запис тренування. */
export async function updateLogAction(logId: string, input: UpdateLogInput) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  await updateLog(logId, user.id, input)
}

/** Перемикає стан улюбленої вправи. Повертає новий стан: true = додано. */
export async function toggleFavoriteAction(exerciseId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return toggleFavorite(user.id, exerciseId)
}
