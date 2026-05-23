// Pattern: Dumb Component — відображає блок "Сьогодні" без власного стану
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { DayWithWeek, Program } from '@/types'

type Props = {
  program: Program
  todayDay: DayWithWeek | null   // null = програму завершено
  dayNumber: number              // 1-based номер поточного дня
  totalDays: number
  locale: string
}

export default function TodayCard({ program, todayDay, dayNumber, totalDays, locale }: Props) {
  const t = useTranslations('dashboard')
  const programTitle = locale === 'en' ? program.title_en : program.title_ua

  // Програму завершено
  if (!todayDay) {
    return (
      <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#16a34a' }}>{t('programDone')}</p>
        <p style={{ color: '#555', marginTop: '0.25rem' }}>{programTitle}</p>
        <Link href="/programs" style={{ display: 'inline-block', marginTop: '1rem', color: '#3b82f6', fontWeight: 500 }}>
          {t('browsePrograms')} →
        </Link>
      </div>
    )
  }

  const weekTitle = locale === 'en' ? todayDay.weeks.title_en : todayDay.weeks.title_ua
  const weekNumber = todayDay.weeks.order  // order — 1-based в БД
  const isStarted = dayNumber > 1

  return (
    <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#eff6ff', border: '2px solid #bfdbfe', marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
        {programTitle}
      </p>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
        {t('dayLabel', { n: dayNumber })} · {t('weekLabel', { n: weekNumber })}
      </h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 0.1rem' }}>
        {weekTitle}
      </p>
      <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
        {t('ofTotal', { total: totalDays })}
      </p>
      <Link
        href={`/workout/${todayDay.id}`}
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          background: '#3b82f6',
          color: '#fff',
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: '1rem',
          textDecoration: 'none',
        }}
      >
        {isStarted ? t('continueWorkout') : t('startWorkout')}
      </Link>
    </div>
  )
}
