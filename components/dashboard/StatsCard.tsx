'use client'
import { useTranslations } from 'next-intl'

export default function StatsCard() {
  const t = useTranslations('stats')
  return (
    <div>
      <h2>{t('title')}</h2>
      {/* TODO: таби 7D / 1M / 3M, значення avg hold, avg reps, total sessions */}
    </div>
  )
}
