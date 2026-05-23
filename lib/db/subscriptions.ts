// Pattern: Repository — ізолює всі запити до subscriptions від решти коду
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import type { Subscription } from '@/types'
/** Повертає підписку користувача або null якщо її немає. */
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

type UpsertPayload = {
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: 'active' | 'canceled' | 'trialing' | 'past_due'
  current_period_end: string
}

/** Вставляє або оновлює підписку після успішного Stripe checkout. */
export async function upsertSubscription(payload: UpsertPayload): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('subscriptions')
    .upsert(payload, { onConflict: 'stripe_subscription_id' })
  if (error) throw error
}

/** Оновлює статус і дату закінчення підписки після Stripe subscription event. */
export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: 'active' | 'canceled' | 'trialing' | 'past_due',
  currentPeriodEnd: string,
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('subscriptions')
    .update({ status, current_period_end: currentPeriodEnd })
    .eq('stripe_subscription_id', stripeSubscriptionId)
  if (error) throw error
}

/** Повертає true якщо користувач має активну підписку або trial ще не закінчився. */
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
