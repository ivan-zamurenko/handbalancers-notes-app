'use client'
import { useTranslations } from 'next-intl'
import type { Plan } from '@/types'

export default function PricingCard({ plan }: { plan?: Plan }) {
  const t = useTranslations('billing')
  // TODO: handleSubscribe → fetch('/api/stripe/checkout', { priceId }) → redirect
  return (
    <div>
      <h3>{plan?.name ?? 'Pro'}</h3>
      <p>{plan?.price ?? '—'} {t('perMonth')}</p>
      {/* TODO: список переваг, кнопка з redirect на Stripe */}
      <button>{t('subscribe')}</button>
    </div>
  )
}
