import { getTranslations } from 'next-intl/server'
import PricingCard from '@/components/billing/PricingCard'
import SubscriptionStatus from '@/components/billing/SubscriptionStatus'

export default async function BillingPage() {
  const t = await getTranslations('billing')

  return (
    <main>
      <h1>{t('title')}</h1>
      <SubscriptionStatus />
      <PricingCard />
    </main>
  )
}
