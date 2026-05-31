import { redirect, notFound } from 'next/navigation'
import { getUser } from '@/lib/db/auth'
import { getExercisesByDay } from '@/lib/db/exercises'
import { getFavoriteExercises } from '@/lib/db/favorites'
import { getDayContext } from '@/lib/db/dayProgress'
import WorkoutDay from '@/components/workout/WorkoutDay'

export default async function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id: dayId } = await params
  const user = await getUser()
  if (!user) redirect(`/${locale}/login`)

  const [exercises, favorites, dayContext] = await Promise.all([
    getExercisesByDay(dayId),
    getFavoriteExercises(user.id),
    getDayContext(dayId),
  ])
  if (!exercises.length) notFound()

  const favoriteIds = new Set(favorites.map(f => f.id))

  return (
    <main style={{ padding: '1rem', paddingBottom: '5rem' }}>
      <WorkoutDay
        dayId={dayId}
        exercises={exercises}
        favoriteIds={[...favoriteIds]}
        locale={locale}
        dayContext={dayContext}
      />
    </main>
  )
}

