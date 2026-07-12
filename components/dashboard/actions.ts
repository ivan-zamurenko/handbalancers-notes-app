'use server'
// Pattern: Service Layer (Server Actions) — проксі між client-компонентами і lib/db/
import { getHandstandChartData, getChartData } from '@/lib/db/workoutLogs'

/** Повертає дані handstand-графіку за вказану кількість днів. */
export async function fetchHandstandChartData(userId: string, days: number) {
  return getHandstandChartData(userId, days)
}

/** Повертає дані графіку конкретної вправи за вказану кількість днів. */
export async function fetchExerciseChartData(userId: string, exerciseId: string, days: number) {
  return getChartData(userId, exerciseId, days)
}
