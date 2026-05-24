import { getTranslations } from 'next-intl/server'
import type { Subscription, SubscriptionStatus } from '@/types'

const STATUS_COLOR: Record<SubscriptionStatus, string> = {
  active: '#39e600',
  trialing: '#2979ff',
  canceled: '#555',
  past_due: '#f87171',
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'ua' ? 'uk-UA' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function SubscriptionStatus({
  subscription,
  locale,
}: {
  subscription: Subscription | null
  locale: string
}) {
  const t = await getTranslations('billing')

  if (!subscription) {
    return (
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>{t('noSubscription')}</p>
    )
  }

  const statusKey = `status${subscription.status.charAt(0).toUpperCase()}${subscription.status.slice(1)}` as
    | 'statusActive' | 'statusTrialing' | 'statusCanceled' | 'statusPastDue'

  return (
    <div style={{
      background: '#141414',
      border: '1px solid #1e1e1e',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
    }}>
      <span style={{
        display: 'inline-block',
        fontSize: '0.8rem',
        fontWeight: 700,
        color: STATUS_COLOR[subscription.status] ?? '#374151',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {t(statusKey)}
      </span>
      <span style={{ fontSize: '0.9rem', color: '#888' }}>
        {t('validUntil')}: {formatDate(subscription.current_period_end, locale)}
      </span>
    </div>
  )
}
