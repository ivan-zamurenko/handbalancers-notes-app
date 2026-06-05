import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getDayByPath } from '@/lib/services/data'
import { getStreak, getDayCompletionStats } from '@/lib/services/training'
import AutoRedirect from '@/components/workout/AutoRedirect'

function parsePart(str: string, prefix: 'w' | 'd'): number | null {
  if (!str.startsWith(prefix)) return null
  const n = Number(str.slice(1))
  return Number.isInteger(n) && n > 0 ? n : null
}

export default async function WorkoutCompletePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; week: string; day: string }>
}) {
  const { locale, slug, week, day } = await params
  const weekOrder = parsePart(week, 'w')
  const dayOrder = parsePart(day, 'd')
  if (!weekOrder || !dayOrder) notFound()

  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('workout')
  const tDash = await getTranslations('dashboard')

  const dayCtx = await getDayByPath(slug, weekOrder, dayOrder)
  if (!dayCtx) notFound()

  const [streak, stats] = await Promise.all([
    getStreak(user.id),
    getDayCompletionStats(user.id, dayCtx.id),
  ])

  const dayTitle = locale === 'en' ? dayCtx.title_en : dayCtx.title_ua
  const programTitle = locale === 'en' ? dayCtx.weeks.programs.title_en : dayCtx.weeks.programs.title_ua

  const holdMin = Math.floor(stats.totalHoldSec / 60)
  const holdSec = stats.totalHoldSec % 60
  const holdLabel = holdMin > 0
    ? t('completionHoldMin', { min: holdMin, sec: holdSec })
    : t('completionHoldSec', { sec: stats.totalHoldSec })

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease-out forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.18s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.32s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.48s; opacity: 0; }
        @keyframes checkPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
        .check-pop { animation: checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

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

          <h1 className="fade-up fade-up-1" style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 0.4rem',
            letterSpacing: '-0.02em',
          }}>
            {t('completionTitle')}
          </h1>

          <p className="fade-up fade-up-2" style={{
            fontSize: '0.95rem',
            color: '#888',
            margin: '0 0 0.2rem',
            fontWeight: 500,
          }}>
            {dayTitle}
          </p>
          <p className="fade-up fade-up-2" style={{
            fontSize: '0.8rem',
            color: '#444',
            margin: '0 0 2rem',
          }}>
            {programTitle}
          </p>

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
