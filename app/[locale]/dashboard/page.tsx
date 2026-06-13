import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getFavoriteExercises, getAllEnrollments, getNextDay, getDoneProgramIdsToday, getRadarData } from '@/lib/services/data'
import { getStreak } from '@/lib/services/training'
import StreakBadge from '@/components/dashboard/StreakBadge'
import ProgressChartWithPeriod from '@/components/dashboard/ProgressChartWithPeriod'
import ActivityRadar from '@/components/dashboard/ActivityRadar'
import FavoriteChartCarousel from '@/components/dashboard/FavoriteChartCarousel'

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

  // Перші 5 улюблених вправ — для каруселі графіків
  const favoriteCharts = favorites.slice(0, 5)

  // TODO список: для кожного enrollment отримуємо наступний день
  const todoItems = await Promise.all(
    enrollments.map(async ({ program }) => {
      const nextDay = await getNextDay(user.id, program.id)
      return { program, nextDay, done: doneTodayIds.has(program.id) }
    })
  )

  const t = await getTranslations('dashboard')
  const hasEnrollment = enrollments.length > 0
  const radarTotal = radarData.reduce((sum, d) => sum + d.count, 0)

  return (
    <main style={hasEnrollment
      ? { padding: '1.5rem 1.25rem 4rem', maxWidth: '960px', margin: '0 auto' }
      : { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 52px)' }
    }>
      {!hasEnrollment ? (
        // ── Empty state ──
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
      ) : (
        <>
          {/* ── Заголовок + streak ── */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{t('title')}</h1>
            <StreakBadge streak={streak} />
          </div>

          <div className="dashboard-grid">
            {/* ── Рядок 1: план | стійка ── */}
            <div className="dashboard-row">
              <div className="dashboard-col-left">
                {todoItems.filter(item => item.nextDay !== null).length > 0 && (
                  <>
                    <h2 style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {t('todayPlan')}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {todoItems.filter(item => item.nextDay !== null).map(({ program, nextDay, done }, idx) => (
                        <div key={program.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.875rem',
                          padding: '1rem 1.125rem',
                          border: `1px solid ${done ? '#1a1a1a' : '#2a2a2a'}`,
                          borderRadius: '16px',
                          background: done ? '#0f0f0f' : '#141414',
                        }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: done ? 'none' : '1.5px solid #2a2a2a', background: done ? '#39e600' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {done && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <polyline points="2,6 5,9 10,3" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: done ? '#444' : '#fff', textDecoration: done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {locale === 'en' ? program.title_en : program.title_ua}
                            </p>
                            {nextDay && !done && (
                              <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#555' }}>
                                {t('dayLabel', { n: nextDay.order })}
                              </p>
                            )}
                          </div>
                          {nextDay && !done && (
                            <Link
                              href={`/programs/${program.slug}/w${nextDay.weeks.order}/d${nextDay.order}`}
                              style={{
                                flexShrink: 0,
                                background: idx === 0 ? '#39e600' : 'transparent',
                                color: idx === 0 ? '#000' : '#39e600',
                                border: idx === 0 ? 'none' : '1px solid #39e600',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '99px',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {t('startWorkout')}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="dashboard-col-right">
                <ProgressChartWithPeriod
                  userId={user.id}
                  title={t('handstandTitle')}
                  type="handstand"
                  unit={locale === 'en' ? 's' : 'с'}
                  height={300}
                  emptyText={t('handstandEmpty')}
                  emptySubText={t('handstandEmptySub')}
                />
              </div>
            </div>

            {/* ── Рядок 2: активність | улюблені вправи ── */}
            <div className="dashboard-row">
              <div className="dashboard-col-left">
                <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t('radarTitle')}
                </h2>
                <div style={{ height: '200px' }}>
                  <ActivityRadar data={radarData} locale={locale} />
                </div>
                {radarTotal > 0 && (
                  <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>
                      {radarTotal}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#555', marginTop: '0.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {locale === 'ua' ? 'вправ виконано' : 'exercises completed'}
                    </span>
                  </div>
                )}
              </div>
              <div className="dashboard-col-right">
                <FavoriteChartCarousel
                  exercises={favoriteCharts}
                  userId={user.id}
                  locale={locale}
                  emptyText={t('chartNoPeriodData')}
                  noFavoritesText={t('noFavorites')}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
