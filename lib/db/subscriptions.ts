import { createClient } from '@/lib/supabase-server'
import type { Subscription } from '@/types'

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data
}

export async function hasActiveAccess(userId: string): Promise<boolean> {
  const supabase = await createClient()

  // Перевіряємо активну підписку
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .single()

  if (sub) return true

  // Перевіряємо trial
  const { data: profile } = await supabase
    .from('profiles')
    .select('trial_ends_at')
    .eq('id', userId)
    .single()

  if (profile?.trial_ends_at) {
    return new Date(profile.trial_ends_at) > new Date()
  }

  return false
}
