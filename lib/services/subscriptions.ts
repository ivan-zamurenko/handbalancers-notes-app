// Pattern: Service Layer — бізнес-логіка підписок та trial-доступу
import { getCurrentUserProfile } from '@/lib/services/auth-service'
import {
  getSubscription as getSubscriptionRepo,
  hasActiveAccess as hasActiveAccessRepo,
  upsertSubscription as upsertSubscriptionRepo,
  updateSubscriptionStatus as updateSubscriptionStatusRepo,
} from '@/lib/db/subscriptions'
import type { Subscription, SubscriptionStatus } from '@/types'
import { DAY_MS } from '@/lib/constants'

export type TrialStatus = {
  hasAccess: boolean
  /** Кількість днів що залишились у trial. null якщо є активна платна підписка. */
  trialDaysLeft: number | null
  /** true коли залишилось 1-2 дні (показати банер-попередження) */
  showWarning: boolean
}

/**
 * Повертає статус доступу: активна підписка → доступ; trial → дні що залишились;
 * trial вичерпано та немає підписки → hasAccess = false.
 */
export async function getTrialStatus(userId: string): Promise<TrialStatus> {
  const sub = await getSubscriptionRepo(userId)
  if (sub && (sub.status === 'active' || sub.status === 'trialing')) {
    return { hasAccess: true, trialDaysLeft: null, showWarning: false }
  }

  const profile = await getCurrentUserProfile(userId)
  if (!profile?.trial_ends_at) {
    return { hasAccess: false, trialDaysLeft: 0, showWarning: false }
  }

  const msLeft = new Date(profile.trial_ends_at).getTime() - Date.now()
  const daysLeft = Math.ceil(msLeft / DAY_MS)

  return {
    hasAccess: daysLeft > 0,
    trialDaysLeft: daysLeft,
    showWarning: daysLeft > 0 && daysLeft <= 2,
  }
}

// Pattern: Facade
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  return getSubscriptionRepo(userId)
}

// Pattern: Facade
export async function userHasActiveAccess(userId: string): Promise<boolean> {
  return hasActiveAccessRepo(userId)
}

// Pattern: Facade
export async function upsertUserSubscription(payload: {
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: SubscriptionStatus
  current_period_end: string
}): Promise<void> {
  await upsertSubscriptionRepo(payload)
}

// Pattern: Facade
export async function updateUserSubscriptionStatus(
  stripeSubscriptionId: string,
  status: SubscriptionStatus,
  currentPeriodEnd: string,
): Promise<void> {
  await updateSubscriptionStatusRepo(stripeSubscriptionId, status, currentPeriodEnd)
}
