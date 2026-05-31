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
      gap: '0.35rem',
      background: 'rgba(255, 150, 0, 0.1)',
      border: '1px solid rgba(255, 150, 0, 0.2)',
      borderRadius: '99px',
      padding: '0.3rem 0.75rem',
      fontSize: '0.8rem',
      color: '#ff9600',
      fontWeight: 600,
      flexShrink: 0,
    }}>
      🔥 {t('streak', { count: streak })}
    </div>
  )
}
