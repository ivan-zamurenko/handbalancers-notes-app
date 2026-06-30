import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import FaqBlock from '@/components/billing/blocks/FaqBlock'
import IncludedFeaturesBlock from '@/components/billing/blocks/IncludedFeaturesBlock'
import ValueIntroBlock from '@/components/billing/blocks/ValueIntroBlock'
import PricingCard from '@/components/billing/PricingCard'
import SubscriptionStatus from '@/components/billing/SubscriptionStatus'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getUserSubscription } from '@/lib/services/subscriptions'
import { getSubscriptionPrice } from '@/lib/services/billing-config'

type ActiveBlock = 'includedFeatures'
type InactiveBlock = 'valueIntro' | 'pricingCard' | 'faq'

export default async function BillingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const { locale } = await params
  const { success, canceled } = await searchParams

  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('billing')
  const subscription = await getUserSubscription(user.id)
  const price = getSubscriptionPrice(locale)

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'
  const features = t.raw('featuresList') as string[]
  const faqItems = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
  ]
  const activeBlocksOrder: ActiveBlock[] = ['includedFeatures']
  const inactiveBlocksOrder: InactiveBlock[] = ['valueIntro', 'pricingCard', 'faq']

  // Pattern: Module / LEGO
  const activeBlocks: Record<ActiveBlock, JSX.Element> = {
    includedFeatures: <IncludedFeaturesBlock title={t('included')} features={features} />,
  }

  // Pattern: Module / LEGO
  const inactiveBlocks: Record<InactiveBlock, JSX.Element> = {
    valueIntro: <ValueIntroBlock headline={t('valueHeadline')} description={t('noSubscription')} />,
    pricingCard: <PricingCard priceId={price.priceId} amountLabel={price.amountLabel} locale={locale} />,
    faq: <FaqBlock title={t('faqTitle')} items={faqItems} />,
  }

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
        activeBlocksOrder.map(block => (
          <div key={block}>{activeBlocks[block]}</div>
        ))
      ) : (
        inactiveBlocksOrder.map(block => (
          <div key={block}>{inactiveBlocks[block]}</div>
        ))
      )}
    </main>
  )
}
