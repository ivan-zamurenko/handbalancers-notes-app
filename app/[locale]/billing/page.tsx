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
  const faqItems = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
  ]

  return (
    <main style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        {t('title')}
      </h1>

      {success && (
        <div style={{
          background: 'rgba(57, 230, 0, 0.07)', border: '1px solid rgba(57, 230, 0, 0.2)', borderRadius: '10px',
          padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#39e600', fontWeight: 500,
        }}>
          {t('successMessage')}
        </div>
      )}
      {canceled && (
        <div style={{
          background: 'rgba(255, 200, 0, 0.06)', border: '1px solid rgba(255, 200, 0, 0.15)', borderRadius: '10px',
          padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#f5a623',
        }}>
          {t('canceledMessage')}
        </div>
      )}

      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#888', marginBottom: '0.75rem' }}>
        {t('subscriptionTitle')}
      </h2>
      <SubscriptionStatus subscription={subscription} locale={locale} />

      {isActive ? (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
            {t('included')}
          </p>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {(t.raw('featuresList') as string[]).map((f: string) => (
              <li key={f} style={{ fontSize: '0.875rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#39e600', fontWeight: 700, flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <section style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 650, color: '#fff', margin: '0 0 0.35rem' }}>{t('valueHeadline')}</p>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>{t('noSubscription')}</p>
          </section>

          <PricingCard priceId={priceId} locale={locale} />

          <section style={{ marginTop: '1.4rem' }}>
            <h3 style={{ color: '#aaa', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 0.65rem' }}>{t('faqTitle')}</h3>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {faqItems.map(item => (
                <div key={item.q} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '0.75rem 0.85rem' }}>
                  <p style={{ color: '#fff', fontSize: '0.86rem', fontWeight: 600, margin: '0 0 0.3rem' }}>{item.q}</p>
                  <p style={{ color: '#777', fontSize: '0.82rem', lineHeight: 1.55, margin: 0 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
