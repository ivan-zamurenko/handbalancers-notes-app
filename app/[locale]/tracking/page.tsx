import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'
import { getLogsByUser } from '@/lib/db/workoutLogs'
import { getFavoriteExercises } from '@/lib/db/favorites'
import TrackingHistory from '@/components/tracking/TrackingHistory'
import ExerciseStats from '@/components/tracking/ExerciseStats'

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
      <ExerciseStats favorites={favorites} logs={logs} locale={locale} />
      <TrackingHistory logs={logs} locale={locale} />
    </main>
  )
}
