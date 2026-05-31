// Pattern: Dumb Component — відображає блок "Сьогодні" без власного стану
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { DayWithWeek, Program } from '@/types'

type Props = {
  program: Program
  todayDay: DayWithWeek         // завжди активний день (null-case обробляє dashboard)
  dayNumber: number              // 1-based номер поточного дня
  totalDays: number
  exerciseCount: number
  locale: string
}

export default function TodayCard({ program, todayDay, dayNumber, totalDays, exerciseCount, locale }: Props) {
  const t = useTranslations('dashboard')
  const programTitle = locale === 'en' ? program.title_en : program.title_ua
  const weekTitle = locale === 'en' ? todayDay.weeks.title_en : todayDay.weeks.title_ua
  const dayTitle = locale === 'en' ? todayDay.title_en : todayDay.title_ua
  const weekNumber = todayDay.weeks.order
  const isStarted = dayNumber > 1
  const pct = Math.round((dayNumber / totalDays) * 100)

  return (
    <div style={{
      borderRadius: '18px',
      background: '#141414',
      border: '1px solid #1e1e1e',
      marginBottom: '1.5rem',
      overflow: 'hidden',
    }}>
      {/* Header strip */}
      <div style={{
        padding: '0.6rem 1.25rem',
        background: '#0f0f0f',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {programTitle}
        </span>
        <span style={{ fontSize: '0.7rem', color: '#39e600', fontWeight: 700 }}>
          {pct}%
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem' }}>
        {/* Week label */}
        <p style={{ fontSize: '0.75rem', color: '#555', margin: '0 0 0.3rem', fontWeight: 500 }}>
          {t('weekLabel', { n: weekNumber })} · {weekTitle}
        </p>

        {/* Day title */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#fff', lineHeight: 1.2 }}>
          {t('dayLabel', { n: dayNumber })} — {dayTitle}
        </h2>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>
            {exerciseCount} {exerciseCount === 1 ? 'вправа' : exerciseCount < 5 ? 'вправи' : 'вправ'}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#444' }}>·</span>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>
            {t('progressDays', { current: dayNumber, total: totalDays })}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', borderRadius: '99px', background: '#1e1e1e', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #2db800, #39e600)',
            borderRadius: '99px',
            transition: 'width 0.5s ease',
          }} />
        </div>

        <Link
          href={`/workout/${todayDay.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.85rem 2rem',
            background: '#39e600',
            color: '#000',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
        >
          <span>{isStarted ? '▶' : '▷'}</span>
          {isStarted ? t('continueWorkout') : t('startWorkout')}
        </Link>
      </div>
    </div>
  )
}
