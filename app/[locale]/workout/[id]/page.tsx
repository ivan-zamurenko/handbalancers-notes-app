import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getExercisesByDay } from '@/lib/db/exercises'
import { getFavoriteExercises } from '@/lib/db/favorites'
import WorkoutDay from '@/components/workout/WorkoutDay'

export default async function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id: dayId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const exercises = await getExercisesByDay(dayId)
  if (!exercises.length) notFound()

  const favorites = await getFavoriteExercises(user.id)
  const favoriteIds = new Set(favorites.map(f => f.id))

  return (
    <main style={{ padding: '1rem' }}>
      <WorkoutDay
        dayId={dayId}
        exercises={exercises}
        favoriteIds={[...favoriteIds]}
        locale={locale}
      />
    </main>
  )
}

