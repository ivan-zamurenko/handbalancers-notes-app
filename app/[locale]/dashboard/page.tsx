import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getChartData, getHandstandChartData, getFavoriteExercises, getAllEnrollments, getNextDay, getDoneProgramIdsToday } from '@/lib/services/data'
import { getStreak } from '@/lib/services/training'
import StreakBadge from '@/components/dashboard/StreakBadge'
import ProgressChart from '@/components/dashboard/ProgressChart'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const [streak, favorites, enrollments, doneTodayIds, handstandData] = await Promise.all([
    getStreak(user.id),
    getFavoriteExercises(user.id),
    getAllEnrollments(user.id),
    getDoneProgramIdsToday(user.id),
    getHandstandChartData(user.id),
  ])

  // Перші 2 улюблені вправи — для 2-го і 3-го графіків
  const favoriteCharts = favorites.slice(0, 2)

  const favoriteChartData = await Promise.all(
    favoriteCharts.map(ex => getChartData(user.id, ex.id).then(data => ({ exercise: ex, data })))
  )

  // TODO список: для кожного enrollment отримуємо наступний день
  const todoItems = await Promise.all(
    enrollments.map(async ({ program }) => {
      const nextDay = await getNextDay(user.id, program.id)
      return { program, nextDay, done: doneTodayIds.has(program.id) }
    })
  )

  const t = await getTranslations('dashboard')
  const hasEnrollment = enrollments.length > 0

  return (
    <main style={hasEnrollment
      ? { padding: '1.5rem 1.25rem 4rem', maxWidth: '600px', margin: '0 auto' }
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
          <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{t('title')}</h1>

          <StreakBadge streak={streak} />

          {/* ── Графік 1: Handstand Hold (завжди) ── */}
          <section style={{ marginTop: '2rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('handstandTitle')}
            </h2>
            {handstandData.length > 0 ? (
              <ProgressChart data={handstandData} height={220} unit={locale === 'en' ? 's' : 'с'} />
            ) : (
              <div style={{ height: '180px', border: '1px solid #1e1e1e', borderRadius: '16px', background: '#141414', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{t('handstandEmpty')}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#555' }}>{t('handstandEmptySub')}</p>
              </div>
            )}
          </section>

          {/* ── Графіки 2–3: улюблені вправи користувача ── */}
          {favoriteChartData.length === 0 ? (
            // Ghost card — підказка відмітити зірочкою
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', opacity: 0.5, userSelect: 'none', pointerEvents: 'none' }}>
              <div style={{ width: '100%', border: '1px dashed #2a2a2a', borderRadius: '16px', padding: '1.25rem', background: '#141414' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ height: '18px', width: '160px', background: '#2a2a2a', borderRadius: '5px' }} />
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px dashed #39e600', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39e600', fontSize: '1rem', flexShrink: 0 }}>★</div>
                </div>
                <div style={{ height: '10px', width: '220px', background: '#222', borderRadius: '4px', marginBottom: '4px' }} />
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', margin: '0.5rem 0 0' }}>
                  <div style={{ height: '9px', width: '32px', background: '#1e1e1e', borderRadius: '3px' }} />
                  <div style={{ height: '9px', width: '48px', background: '#2a2a2a', borderRadius: '3px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
                  <line x1="12" y1="34" x2="12" y2="6" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
                  <polyline points="6,13 12,5 18,13" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', textAlign: 'center', lineHeight: 1.5, fontStyle: 'italic' }}>{t('noFavorites')}</p>
              </div>
            </div>
          ) : favoriteChartData.length === 1 ? (
            // 1 улюблена — розтягнути на всю ширину як перший графік
            <section style={{ marginTop: '2rem' }}>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {locale === 'en' ? favoriteChartData[0].exercise.name_en : favoriteChartData[0].exercise.name_ua}
              </h2>
              <ProgressChart
                data={favoriteChartData[0].data}
                height={200}
                unit={favoriteChartData[0].exercise.target_hold != null ? (locale === 'en' ? 's' : 'с') : undefined}
              />
            </section>
          ) : (
            // 2 улюблених — пліч-о-пліч, по 50%
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
              {favoriteChartData.map(({ exercise, data: exData }) => (
                <section key={exercise.id} style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {locale === 'en' ? exercise.name_en : exercise.name_ua}
                  </h2>
                  <ProgressChart
                    data={exData}
                    height={160}
                    unit={exercise.target_hold != null ? (locale === 'en' ? 's' : 'с') : undefined}
                  />
                </section>
              ))}
            </div>
          )}

          {/* ── План на сьогодні ── */}
          {todoItems.length > 0 && (
            <section style={{ marginTop: '2.5rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t('todayPlan')}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {todoItems.map(({ program, nextDay, done }) => (
                  <div key={program.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', border: '1px solid #1e1e1e', borderRadius: '14px', background: '#141414' }}>
                    {/* Чекбокс */}
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: done ? 'none' : '1.5px solid #2a2a2a', background: done ? '#39e600' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                      {done && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <polyline points="2,6 5,9 10,3" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    {/* Назва + підзаголовок */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: done ? '#555' : '#fff', textDecoration: done ? 'line-through' : 'none' }}>
                        {locale === 'en' ? program.title_en : program.title_ua}
                      </p>
                      {nextDay && !done && (
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#555' }}>
                          {t('dayLabel', { n: nextDay.order })}
                        </p>
                      )}
                      {!nextDay && (
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#39e600' }}>
                          {t('programComplete')}
                        </p>
                      )}
                    </div>
                    {/* Кнопка переходу — тільки якщо є наступний день і ще не виконано */}
                    {nextDay && !done && (
                      <Link
                        href={`/programs/${program.slug}/${nextDay.weeks.order}/${nextDay.order}`}
                        style={{ flexShrink: 0, background: '#39e600', color: '#000', fontWeight: 700, fontSize: '0.78rem', padding: '0.45rem 0.875rem', borderRadius: '99px', textDecoration: 'none', whiteSpace: 'nowrap' }}
                      >
                        {t('startWorkout')}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}
