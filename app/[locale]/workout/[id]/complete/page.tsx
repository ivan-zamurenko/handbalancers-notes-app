import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getUser } from '@/lib/db/auth'
import { getDayContext } from '@/lib/db/dayProgress'
import { getStreak } from '@/lib/services/training'

export default async function WorkoutCompletePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id: dayId } = await params
  const user = await getUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('workout')
  const tDash = await getTranslations('dashboard')

  const [day, streak] = await Promise.all([
    getDayContext(dayId),
    getStreak(user.id),
  ])

  const dayTitle = day ? (locale === 'en' ? day.title_en : day.title_ua) : ''
  const programTitle = day ? (locale === 'en' ? day.weeks.programs.title_en : day.weeks.programs.title_ua) : ''

  return (
    <>
      {/* CSS-анімація для emoji */}
      <style>{`
        @keyframes celebrationBounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.15) rotate(-5deg); }
          75% { transform: scale(1.15) rotate(5deg); }
        }
        .celebration-emoji {
          display: inline-block;
          animation: celebrationBounce 1.2s ease-in-out infinite;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease-out forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.6s; opacity: 0; }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>

          {/* Emoji */}
          <div className="celebration-emoji" style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: 1 }}>
            🎉
          </div>

          {/* Заголовок */}
          <h1 className="fade-up fade-up-1" style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#15803d',
            margin: '0 0 0.5rem',
          }}>
            {t('completionTitle')}
          </h1>

          {/* Назва дня */}
          {dayTitle && (
            <p className="fade-up fade-up-2" style={{
              fontSize: '1rem',
              color: '#374151',
              margin: '0 0 0.25rem',
              fontWeight: 500,
            }}>
              {dayTitle}
            </p>
          )}
          {programTitle && (
            <p className="fade-up fade-up-2" style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              margin: '0 0 2rem',
            }}>
              {programTitle}
            </p>
          )}

          {/* Стрік-бейдж */}
          {streak > 0 && (
            <div className="fade-up fade-up-3" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fff',
              border: '2px solid #fde68a',
              borderRadius: '999px',
              padding: '0.6rem 1.5rem',
              marginBottom: '2.5rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#92400e',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              🔥 {tDash('streak', { count: streak })}
            </div>
          )}
          {streak === 0 && (
            <div style={{ marginBottom: '2.5rem' }} />
          )}

          {/* Підзаголовок */}
          <p className="fade-up fade-up-3" style={{
            fontSize: '1rem',
            color: '#4b5563',
            marginBottom: '2.5rem',
          }}>
            {t('completionSubtitle')}
          </p>

          {/* Кнопка */}
          <div className="fade-up fade-up-4">
            <Link
              href="/dashboard"
              style={{
                display: 'inline-block',
                padding: '0.875rem 2.5rem',
                background: '#16a34a',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1.05rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)',
              }}
            >
              {t('backHome')}
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
