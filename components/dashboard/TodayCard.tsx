// Pattern: Dumb Component — відображає блок "Сьогодні" без власного стану
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { DayWithWeek, Program } from '@/types'

type Props = {
  program: Program
  todayDay: DayWithWeek         // завжди активний день (null-case обробляє dashboard)
  dayNumber: number              // 1-based номер поточного дня
  totalDays: number
  locale: string
}

export default function TodayCard({ program, todayDay, dayNumber, totalDays, locale }: Props) {
  const t = useTranslations('dashboard')
  const programTitle = locale === 'en' ? program.title_en : program.title_ua
  const weekTitle = locale === 'en' ? todayDay.weeks.title_en : todayDay.weeks.title_ua
  const weekNumber = todayDay.weeks.order  // order — 1-based в БД
  const isStarted = dayNumber > 1

  return (
    <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#141414', border: '1px solid #1e1e1e', marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.8rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
        {programTitle}
      </p>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem', color: '#fff' }}>
        {t('dayLabel', { n: dayNumber })} · {t('weekLabel', { n: weekNumber })}
      </h2>
      <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 1rem' }}>
        {weekTitle}
      </p>
      {/* Progress bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#555' }}>{t('progressDays', { current: dayNumber, total: totalDays })}</span>
          <span style={{ fontSize: '0.75rem', color: '#39e600', fontWeight: 600 }}>{Math.round((dayNumber / totalDays) * 100)}%</span>
        </div>
        <div style={{ height: '4px', borderRadius: '99px', background: '#1e1e1e', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(dayNumber / totalDays) * 100}%`, background: '#39e600', borderRadius: '99px', transition: 'width 0.4s ease' }} />
        </div>
      </div>
      <Link
        href={`/workout/${todayDay.id}`}
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          background: '#39e600',
          color: '#000',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '1rem',
          textDecoration: 'none',
        }}
      >
        {isStarted ? t('continueWorkout') : t('startWorkout')}
      </Link>
    </div>
  )
}
