'use client'
import { useTranslations } from 'next-intl'

interface Props {
  totalSessions: number
  avgHold: number
  avgReps: number
}

export default function StatsCard({ totalSessions, avgHold, avgReps }: Props) {
  const t = useTranslations('stats')
  return (
    <div>
      <h2>{t('title')}</h2>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
        <div><strong>{totalSessions}</strong> {t('totalSessions')}</div>
        <div><strong>{avgHold}</strong> {t('seconds')} {t('avgHold')}</div>
        <div><strong>{avgReps}</strong> {t('reps')} {t('avgReps')}</div>
      </div>
    </div>
  )
}
