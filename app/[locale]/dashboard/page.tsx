import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getFavoriteExercises, getAllEnrollments, getNextDay, getCompletedDayIds, getTotalDaysInProgram, getDoneProgramIdsToday, getRadarData } from '@/lib/services/data'
import { getStreak } from '@/lib/services/training'
import StreakBadge from '@/components/dashboard/StreakBadge'
import ActivityRadar from '@/components/dashboard/ActivityRadar'
import FavoriteChartCarousel from '@/components/dashboard/FavoriteChartCarousel'

// Тонкий прогрес-бар програми (День N з M) — використовується в герой-картці.
function ProgressBar({ completed, total, label }: { completed: number; total: number; label: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0
  return (
    <div style={{ margin: '1.25rem 0' }}>
      <div style={{ height: '6px', borderRadius: '99px', background: '#222', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: '#39e600', borderRadius: '99px' }} />
      </div>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#777' }}>{label}</p>
    </div>
  )
}

const ctaPrimary: CSSProperties = {
  display: 'block', textAlign: 'center', background: '#39e600', color: '#000',
  fontWeight: 700, fontSize: '0.95rem', padding: '0.85rem', borderRadius: '12px', textDecoration: 'none',
}
const ctaSecondary: CSSProperties = {
  display: 'block', textAlign: 'center', background: 'transparent', color: '#39e600',
  border: '1px solid #2a4a1a', fontWeight: 700, fontSize: '0.9rem', padding: '0.8rem', borderRadius: '12px', textDecoration: 'none',
}
const sectionHeader: CSSProperties = {
  margin: '0 0 1rem', fontSize: '0.8rem', fontWeight: 600, color: '#666',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const [streak, favorites, enrollments, doneTodayIds, radarData] = await Promise.all([
    getStreak(user.id),
    getFavoriteExercises(user.id),
    getAllEnrollments(user.id),
    getDoneProgramIdsToday(user.id),
    getRadarData(user.id),
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
  const radarTotal = radarData.reduce((sum, d) => sum + d.count, 0)

  const rawDate = new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })
  const dateLabel = rawDate.charAt(0).toUpperCase() + rawDate.slice(1)

  // Дані герой-картки
  const pTitle = locale === 'en' ? primary.program.title_en : primary.program.title_ua
  const progressLabel = t('progressDays', { current: primary.completedCount, total: primary.totalDays })
  const nextHref = primary.nextDay
    ? `/programs/${primary.program.slug}/w${primary.nextDay.weeks.order}/d${primary.nextDay.order}`
    : ''

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1.25rem 4rem' }}>
      {/* ── Заголовок: дата + Сьогодні + streak ── */}
      <header style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: 500 }}>{dateLabel}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.15rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{t('title')}</h1>
          <StreakBadge streak={streak} />
        </div>
      </header>

      {/* ── Герой: наступне тренування ── */}
      <section style={{
        border: '1px solid #1f1f1f',
        borderRadius: '20px',
        background: 'linear-gradient(180deg, #161616 0%, #111 100%)',
        padding: '1.5rem',
        marginBottom: others.length > 0 ? '1rem' : '2.5rem',
      }}>
        {!primary.nextDay ? (
          // Програму завершено
          <>
            <p style={{ margin: 0, fontSize: '2rem' }}>🎉</p>
            <h2 style={{ margin: '0.5rem 0 0', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>{t('programDone')}</h2>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: '#888' }}>{pTitle}</p>
            <ProgressBar completed={primary.totalDays} total={primary.totalDays} label={progressLabel} />
            <Link href="/programs" style={ctaSecondary}>{t('browsePrograms')}</Link>
          </>
        ) : primary.doneToday ? (
          // Сьогодні вже тренувався — можна продовжити
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#39e600', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <polyline points="2,6 5,9 10,3" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>{t('doneToday')}</h2>
            </div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#888' }}>{pTitle}</p>
            <ProgressBar completed={primary.completedCount} total={primary.totalDays} label={progressLabel} />
            <Link href={nextHref} style={ctaSecondary}>{t('continueWorkout')}</Link>
          </>
        ) : (
          // Активний день — головний CTA
          <>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>{pTitle}</p>
            <h2 style={{ margin: '0.3rem 0 0', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.2 }}>
              {locale === 'en' ? primary.nextDay.title_en : primary.nextDay.title_ua}
            </h2>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#666' }}>{t('weekLabel', { n: primary.nextDay.weeks.order })}</p>
            <ProgressBar completed={primary.completedCount} total={primary.totalDays} label={progressLabel} />
            <Link href={nextHref} style={ctaPrimary}>{t('startWorkout')} →</Link>
          </>
        )}
      </section>

      {/* ── Інші програми (компактно) ── */}
      {others.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem' }}>
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

      {/* ── Прогрес: графіки обраних вправ (лише якщо є обрані) ── */}
      {favoriteCharts.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
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

      {/* ── Активність: radar лише коли є дані ── */}
      {radarTotal > 0 && (
        <section>
          <h2 style={sectionHeader}>{t('radarTitle')}</h2>
          <div style={{ height: '220px' }}>
            <ActivityRadar data={radarData} locale={locale} />
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#777', margin: '0.5rem 0 0' }}>
            {t('radarTotal', { count: radarTotal })}
          </p>
        </section>
      )}
    </main>
  )
}
