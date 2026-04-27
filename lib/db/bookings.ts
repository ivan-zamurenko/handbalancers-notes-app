import { createClient } from '@/lib/supabase-server'
import type { Booking } from '@/types'

export async function getBookingsByUser(userId: string): Promise<Booking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export type CreateBookingInput = {
  scheduled_at?: string
  note?: string
}

export async function createBooking(
  userId: string,
  input: CreateBookingInput
): Promise<Booking> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}
