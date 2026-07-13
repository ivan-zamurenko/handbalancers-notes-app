import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getFavoriteExercises, getAllEnrollments, getNextDay, getCompletedDayIds, getTotalDaysInProgram, getDoneProgramIdsToday, getDashboardStats } from '@/lib/services/data'
import { getStreak } from '@/lib/services/training'
import FavoriteChartCarousel from '@/components/dashboard/FavoriteChartCarousel'
import ProgressMotivation from '@/components/dashboard/ProgressMotivation'

// Кільце прогресу програми — головний емоційний елемент героя (виконано N з M днів).
function ProgressRing({ completed, total, ofLabel, daysLabel }: { completed: number; total: number; ofLabel: string; daysLabel: string }) {
  const size = 88
  const stroke = 7
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? Math.min(1, completed / total) : 0
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#242424" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#39e600" strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, color: '#fff', letterSpacing: '-0.02em' }}>{completed}</span>
        <span style={{ fontSize: '0.7rem', color: '#666', marginTop: '1px' }}>{ofLabel}</span>
        <span style={{ fontSize: '0.58rem', color: '#444', marginTop: '1px', letterSpacing: '0.02em' }}>{daysLabel}</span>
      </div>
    </div>
  )
}

const ctaPrimary: CSSProperties = {
  display: 'block', textAlign: 'center', background: '#39e600', color: '#000',
  fontWeight: 700, fontSize: '0.95rem', padding: '0.9rem', borderRadius: '14px', textDecoration: 'none', marginTop: '1.5rem',
}
const ctaSecondary: CSSProperties = {
  display: 'block', textAlign: 'center', background: 'transparent', color: '#39e600',
  border: '1px solid #2a4a1a', fontWeight: 700, fontSize: '0.9rem', padding: '0.85rem', borderRadius: '14px', textDecoration: 'none', marginTop: '1.5rem',
}
const sectionHeader: CSSProperties = {
  margin: '0 0 1rem', fontSize: '0.8rem', fontWeight: 600, color: '#666',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}
const streakChip: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#1a1a1a',
  borderRadius: '99px', padding: '2px 9px', fontSize: '0.78rem', fontWeight: 700, color: '#fff',
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const [streak, favorites, enrollments, doneTodayIds, stats] = await Promise.all([
    getStreak(user.id),
    getFavoriteExercises(user.id),
    getAllEnrollments(user.id),
    getDoneProgramIdsToday(user.id),
    getDashboardStats(user.id),
  ])

  const t = await getTranslations('dashboard')
  const hasEnrollment = enrollments.length > 0

  // ── Empty state: жодної програми ──
  if (!hasEnrollment) {
    return (
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 52px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1.5px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L12 8M12 16L12 22M2 12L8 12M16 12L22 12" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{t('noProgram')}</p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#555', maxWidth: '280px', lineHeight: 1.5 }}>{t('noProgramSub')}</p>
          <Link href="/programs" style={{ marginTop: '0.75rem', display: 'inline-block', background: '#39e600', color: '#000', fontWeight: 700, fontSize: '0.875rem', padding: '0.6rem 1.5rem', borderRadius: '99px', textDecoration: 'none' }}>
            {t('browsePrograms')}
          </Link>
        </div>
      </main>
    )
  }

  // Для кожної програми: наступний день + прогрес (виконано N з M днів)
  const programCards = await Promise.all(
    enrollments.map(async ({ program }) => {
      const [nextDay, completedIds, totalDays] = await Promise.all([
        getNextDay(user.id, program.id),
        getCompletedDayIds(user.id, program.id),
        getTotalDaysInProgram(program.id),
      ])
      return { program, nextDay, completedCount: completedIds.size, totalDays, doneToday: doneTodayIds.has(program.id) }
    })
  )

  const primary = programCards[0]
  const others = programCards.slice(1)
  const favoriteCharts = favorites.slice(0, 5)

  const rawDate = new Date()
  const dateLocale = locale === 'en' ? 'en-US' : 'uk-UA'
  // День тижня форматуємо окремо — так ICU дає називний відмінок ("середа", а не "середу")
  const weekday = rawDate.toLocaleDateString(dateLocale, { weekday: 'long' })
  const dayMonth = rawDate.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long' })
  const dateLabel = `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${dayMonth}`

  // Дані герой-картки
  const pTitle = locale === 'en' ? primary.program.title_en : primary.program.title_ua
  const nextHref = primary.nextDay
    ? `/programs/${primary.program.slug}/w${primary.nextDay.weeks.order}/d${primary.nextDay.order}`
    : ''

  // Підпис героя залежно від стану
  let heroTitle: string
  if (!primary.nextDay) heroTitle = t('programDone')
  else if (primary.doneToday) heroTitle = t('doneToday')
  else heroTitle = locale === 'en' ? primary.nextDay.title_en : primary.nextDay.title_ua

  const ringCompleted = primary.nextDay ? primary.completedCount : primary.totalDays

  return (
    <main style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 1.25rem 5rem' }}>
      {/* ── Заголовок: дата + Сьогодні ── */}
      <header style={{ marginBottom: '2rem' }}>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: 500 }}>{dateLabel}</p>
        <h1 style={{ margin: '0.15rem 0 0', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{t('title')}</h1>
      </header>

      {/* ── Герой: кільце прогресу + наступний крок ── */}
      <section style={{
        border: '1px solid #1f1f1f',
        borderRadius: '24px',
        background: 'linear-gradient(180deg, #171717 0%, #101010 100%)',
        padding: '1.75rem',
        marginBottom: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <ProgressRing completed={ringCompleted} total={primary.totalDays} ofLabel={t('ofTotal', { total: primary.totalDays })} daysLabel={t('days')} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#888', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pTitle}</p>
            <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.15 }}>{heroTitle}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.45rem' }}>
              {primary.nextDay && (
                <span style={{ fontSize: '0.85rem', color: '#666' }}>{t('weekLabel', { n: primary.nextDay.weeks.order })}</span>
              )}
              {streak > 0 && <span style={streakChip}>🔥 {streak}</span>}
            </div>
          </div>
        </div>

        {!primary.nextDay ? (
          <Link href="/programs" style={ctaSecondary}>{t('browsePrograms')}</Link>
        ) : primary.doneToday ? (
          <Link href={nextHref} style={ctaSecondary}>{t('continueWorkout')}</Link>
        ) : (
          <Link href={nextHref} style={ctaPrimary}>
            {primary.completedCount > 0 ? t('continueWorkout') : t('startWorkout')} →
          </Link>
        )}
      </section>

      {/* ── Статистика ── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: others.length > 0 ? '0.75rem' : '3.5rem' }}>
        <div style={{ flex: 1, background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '1rem 1.125rem' }}>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{stats.totalSessions}</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#555', fontWeight: 500 }}>{t('trainingSessions')}</p>
        </div>
        <div style={{ flex: 1, background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '1rem 1.125rem' }}>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: streak > 0 ? '#fff' : '#2a2a2a', letterSpacing: '-0.02em', lineHeight: 1 }}>🔥 {streak}</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#555', fontWeight: 500 }}>{t('streakLabel')}</p>
        </div>
      </div>

      {/* ── Інші програми (компактно) ── */}
      {others.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3.5rem' }}>
          {others.map(({ program, nextDay, doneToday }) => {
            const title = locale === 'en' ? program.title_en : program.title_ua
            return (
              <div key={program.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', border: '1px solid #1a1a1a', borderRadius: '14px', background: '#121212' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: doneToday ? 'none' : '1.5px solid #2a2a2a', background: doneToday ? '#39e600' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {doneToday && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6 5,9 10,3" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
                  {nextDay && <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: '#666' }}>{t('dayLabel', { n: nextDay.order })}</p>}
                </div>
                {nextDay && !doneToday && (
                  <Link href={`/programs/${program.slug}/w${nextDay.weeks.order}/d${nextDay.order}`} style={{ flexShrink: 0, color: '#39e600', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}>
                    {t('startWorkout')} →
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Мотивація для нових юзерів (менше 5 тренувань) ── */}
      {stats.totalSessions < 5 && <ProgressMotivation />}

      {/* ── Твій ріст: графіки обраних вправ (лише якщо є обрані) ── */}
      {favoriteCharts.length > 0 && (
        <section>
          <h2 style={sectionHeader}>{t('progressTitle')}</h2>
          <FavoriteChartCarousel
            exercises={favoriteCharts}
            userId={user.id}
            locale={locale}
            emptyText={t('chartNoPeriodData')}
            noFavoritesText={t('noFavorites')}
          />
        </section>
      )}
    </main>
  )
}
