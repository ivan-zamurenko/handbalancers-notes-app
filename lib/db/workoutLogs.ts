import { createClient } from '@/lib/supabase-server'
import type { WorkoutLog } from '@/types'

export async function getLogsByUser(userId: string): Promise<WorkoutLog[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getLogsByExercise(
  userId: string,
  exerciseId: string
): Promise<WorkoutLog[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .order('logged_at', { ascending: true })

  if (error) throw error
  return data
}

export type CreateLogInput = {
  exercise_id: string
  sets?: number
  reps?: number
  achieved_hold?: number
  video_url?: string
  note?: string
}

export async function createLog(userId: string, input: CreateLogInput): Promise<WorkoutLog> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}
