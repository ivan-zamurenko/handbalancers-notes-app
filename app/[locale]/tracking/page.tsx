import { getTranslations } from 'next-intl/server'
import TrackingHistory from '@/components/tracking/TrackingHistory'
import ExerciseStats from '@/components/tracking/ExerciseStats'

export default async function TrackingPage() {
  const t = await getTranslations('tracking')

  return (
    <main>
      <h1>{t('title')}</h1>
      <ExerciseStats />
      <TrackingHistory />
    </main>
  )
}
