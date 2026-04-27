'use client'
import { useTranslations } from 'next-intl'

export default function SubscriptionStatus() {
  const t = useTranslations('billing')
  return (
    <div>
      <h2>{t('subscriptionTitle')}</h2>
      {/* TODO: план, статус (active/canceled/trialing), дата, кнопка "Скасувати" */}
    </div>
  )
}
