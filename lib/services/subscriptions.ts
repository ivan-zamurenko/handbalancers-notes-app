// Pattern: Service Layer — бізнес-логіка підписок та trial-доступу
import { getProfile } from '@/lib/db/auth'
import { getSubscription } from '@/lib/db/subscriptions'

const DAY_MS = 86_400_000

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
  const sub = await getSubscription(userId)
  if (sub && (sub.status === 'active' || sub.status === 'trialing')) {
    return { hasAccess: true, trialDaysLeft: null, showWarning: false }
  }

  const profile = await getProfile(userId)
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
