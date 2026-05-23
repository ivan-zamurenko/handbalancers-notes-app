import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import PricingCard from '@/components/billing/PricingCard'
import SubscriptionStatus from '@/components/billing/SubscriptionStatus'
import { getUser } from '@/lib/db/auth'
import { getSubscription } from '@/lib/db/subscriptions'

export default async function BillingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const { locale } = await params
  const { success, canceled } = await searchParams

  const user = await getUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('billing')
  const subscription = await getSubscription(user.id)
  const priceId = process.env.STRIPE_PRICE_ID!

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'

  return (
    <main style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        {t('title')}
      </h1>

      {success && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px',
          padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#15803d', fontWeight: 500,
        }}>
          ✅ {t('successMessage')}
        </div>
      )}
      {canceled && (
        <div style={{
          background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '10px',
          padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#92400e',
        }}>
          {t('canceledMessage')}
        </div>
      )}

      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
        {t('subscriptionTitle')}
      </h2>
      <SubscriptionStatus subscription={subscription} locale={locale} />

      {!isActive && (
        <PricingCard priceId={priceId} locale={locale} />
      )}
    </main>
  )
}
