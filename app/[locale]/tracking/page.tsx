import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getLogsByUser, getFavoriteExercises } from '@/lib/services/data'
import TrackingClient from '@/components/tracking/TrackingClient'

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('tracking')

  // Завантажуємо логи і улюблені вправи паралельно
  const [logs, favorites] = await Promise.all([
    getLogsByUser(user.id),
    getFavoriteExercises(user.id),
  ])

  return (
    <main style={{ padding: '1.5rem 1.25rem 4rem', maxWidth: '600px', margin: '0 auto' }}>
      <TrackingClient logs={logs} favorites={favorites} locale={locale} />
    </main>
  )
}
