'use client'
import { useTranslations } from 'next-intl'

interface Props {
  streak?: number
}

export default function StreakBadge({ streak = 0 }: Props) {
  const t = useTranslations('dashboard')

  return (
    <div>
      <span>🔥 {streak > 0 ? t('streak', { count: streak }) : t('streakZero')}</span>
    </div>
  )
}
