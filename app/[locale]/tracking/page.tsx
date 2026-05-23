import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/db/auth'
import { getLogsByUser } from '@/lib/db/workoutLogs'
import { getFavoriteExercises } from '@/lib/db/favorites'
import TrackingClient from '@/components/tracking/TrackingClient'

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('tracking')

  // Завантажуємо логи і улюблені вправи паралельно
  const [logs, favorites] = await Promise.all([
    getLogsByUser(user.id),
    getFavoriteExercises(user.id),
  ])

  return (
    <main style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{t('title')}</h1>
      <TrackingClient logs={logs} favorites={favorites} locale={locale} />
    </main>
  )
}
