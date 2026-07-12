import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getDayContext } from '@/lib/services/data'
import { getStreak, getDayCompletionStats } from '@/lib/services/training'
import AutoRedirect from '@/components/workout/AutoRedirect'

export default async function WorkoutCompletePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id: dayId } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('workout')
  const tDash = await getTranslations('dashboard')

  const [day, streak, stats] = await Promise.all([
    getDayContext(dayId),
    getStreak(user.id),
    getDayCompletionStats(user.id, dayId),
  ])

  const dayTitle = day ? (locale === 'en' ? day.title_en : day.title_ua) : ''
  const programTitle = day ? (locale === 'en' ? day.weeks.programs.title_en : day.weeks.programs.title_ua) : ''

  const holdMin = Math.floor(stats.totalHoldSec / 60)
  const holdSec = stats.totalHoldSec % 60
  const holdLabel = holdMin > 0
    ? t('completionHoldMin', { min: holdMin, sec: holdSec })
    : t('completionHoldSec', { sec: stats.totalHoldSec })

  return (
    <>
      <main style={{
        minHeight: '100vh',
        background: '#0d0d0d',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(57,230,0,0.1) 0%, transparent 55%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '380px', width: '100%' }}>

          {/* Check circle */}
          <div className="check-pop" style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            border: '2.5px solid #39e600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            color: '#39e600',
            boxShadow: '0 0 40px rgba(57,230,0,0.2)',
            margin: '0 auto 1.75rem',
          }}>
            ✓
          </div>

          {/* Заголовок */}
          <h1 className="fade-up fade-up-1" style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 0.4rem',
            letterSpacing: '-0.02em',
          }}>
            {t('completionTitle')}
          </h1>

          {/* Назва дня + програма */}
          {dayTitle && (
            <p className="fade-up fade-up-2" style={{
              fontSize: '0.95rem',
              color: '#888',
              margin: '0 0 0.2rem',
              fontWeight: 500,
            }}>
              {dayTitle}
            </p>
          )}
          {programTitle && (
            <p className="fade-up fade-up-2" style={{
              fontSize: '0.8rem',
              color: '#444',
              margin: '0 0 2rem',
            }}>
              {programTitle}
            </p>
          )}

          {/* Статистика дня */}
          <div className="fade-up fade-up-3" style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            marginBottom: '2.25rem',
          }}>
            {stats.exercisesLogged > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{stats.exercisesLogged}</div>
                <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.2rem' }}>{t('completionExercisesLabel')}</div>
              </div>
            )}
            {stats.totalHoldSec > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#39e600' }}>{holdLabel}</div>
                <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.2rem' }}>{t('completionHoldLabel')}</div>
              </div>
            )}
            {streak > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{streak}</div>
                <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.2rem' }}>{tDash('streakLabel')}</div>
              </div>
            )}
          </div>

          {/* Кнопка */}
          <div className="fade-up fade-up-4">
            <Link
              href="/dashboard"
              style={{
                display: 'inline-block',
                padding: '0.875rem 2.5rem',
                background: '#39e600',
                color: '#000',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              {t('backHome')}
            </Link>
            <AutoRedirect />
          </div>

        </div>
      </main>
    </>
  )
}

