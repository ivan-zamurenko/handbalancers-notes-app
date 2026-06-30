import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getLogsByUser, getFavoriteExercises, getRadarData } from '@/lib/services/data'
import TrackingClient from '@/components/tracking/TrackingClient'
import ActivityRadar from '@/components/dashboard/ActivityRadar'

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('tracking')

  // Завантажуємо логи, улюблені вправи і дані активності паралельно
  const [logs, favorites, radarData] = await Promise.all([
    getLogsByUser(user.id),
    getFavoriteExercises(user.id),
    getRadarData(user.id),
  ])

  const radarTotal = radarData.reduce((sum, d) => sum + d.count, 0)

  // ── Empty state: поки немає жодного запису — нічого відстежувати ──
  if (logs.length === 0) {
    return (
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 52px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1.5px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 14l4-4 3 3 5-6" />
            </svg>
          </div>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{t('empty')}</p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#555', maxWidth: '280px', lineHeight: 1.5 }}>{t('emptySub')}</p>
          <Link href="/dashboard" style={{ marginTop: '0.75rem', display: 'inline-block', background: '#39e600', color: '#000', fontWeight: 700, fontSize: '0.875rem', padding: '0.6rem 1.5rem', borderRadius: '99px', textDecoration: 'none' }}>
            {t('emptyCta')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{t('title')}</h1>
      {radarTotal > 0 && (
        <section style={{ margin: '0.5rem 0 2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('radarTitle')}
          </h2>
          <div style={{ height: '240px' }}>
            <ActivityRadar data={radarData} locale={locale} />
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#777', margin: '0.5rem 0 0' }}>
            {t('radarTotal', { count: radarTotal })}
          </p>
        </section>
      )}
      <TrackingClient logs={logs} favorites={favorites} locale={locale} />
    </main>
  )
}
