'use client'
import { useTranslations } from 'next-intl'

interface Props {
  streak?: number
}

export default function StreakBadge({ streak = 0 }: Props) {
  const t = useTranslations('dashboard')

  if (streak === 0) return null

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.85rem',
      color: '#ff9600',
      fontWeight: 600,
      flexShrink: 0,
    }}>
      {t('streak', { count: streak })}
    </div>
  )
}
