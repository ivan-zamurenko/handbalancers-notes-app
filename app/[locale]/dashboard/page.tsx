import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'
import { getStreak, getChartData } from '@/lib/db/workoutLogs'
import { getFavoriteExercises } from '@/lib/db/favorites'
import StreakBadge from '@/components/dashboard/StreakBadge'
import ProgressChart from '@/components/dashboard/ProgressChart'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const [streak, favorites] = await Promise.all([
    getStreak(user.id),
    getFavoriteExercises(user.id),
  ])

  const chartDataPerExercise = await Promise.all(
    favorites.map(ex => getChartData(user.id, ex.id).then(data => ({ exercise: ex, data })))
  )

  const t = await getTranslations('dashboard')

  return (
    <main>
      <h1>{t('title')}</h1>
      <StreakBadge streak={streak} />

      {favorites.length === 0 && <p>{t('noFavorites')}</p>}

      {chartDataPerExercise.map(({ exercise, data }) => (
        <section key={exercise.id}>
          <h2>⭐ {exercise.name}</h2>
          <ProgressChart data={data} />
        </section>
      ))}
    </main>
  )
}
