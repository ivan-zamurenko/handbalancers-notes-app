'use client'
import { useTranslations } from 'next-intl'

export default function TrackingHistory() {
  const t = useTranslations('tracking')
  return (
    <div>
      <h2>{t('historyTitle')}</h2>
      {/* TODO: фільтри, таблиця записів */}
    </div>
  )
}
