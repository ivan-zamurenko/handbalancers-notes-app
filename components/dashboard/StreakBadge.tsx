'use client'
import { useTranslations } from 'next-intl'

interface Props {
  streak?: number
}

export default function StreakBadge({ streak = 0 }: Props) {
  const t = useTranslations('dashboard')

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      background: '#141414',
      border: '1px solid #2a2a2a',
      borderRadius: '99px',
      padding: '0.3rem 0.75rem',
      fontSize: '0.8rem',
      color: streak > 0 ? '#fff' : '#555',
      fontWeight: 500,
      flexShrink: 0,
    }}>
      🔥 {streak > 0 ? t('streak', { count: streak }) : t('streakZero')}
    </div>
  )
}
