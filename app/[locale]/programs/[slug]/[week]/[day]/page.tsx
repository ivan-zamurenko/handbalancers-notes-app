import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getExercisesByDay, getFavoriteExercises, getDayByPath } from '@/lib/services/data'
import WorkoutDay from '@/components/workout/WorkoutDay'

/** Парсить сегмент виду `w1`/`d3`. Повертає число або null. */
function parsePart(str: string, prefix: 'w' | 'd'): number | null {
  if (!str.startsWith(prefix)) return null
  const n = Number(str.slice(1))
  return Number.isInteger(n) && n > 0 ? n : null
}

export default async function WorkoutSessionPage({
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

  const dayContext = await getDayByPath(slug, weekOrder, dayOrder)
  if (!dayContext) notFound()

  const [exercises, favorites] = await Promise.all([
    getExercisesByDay(dayContext.id),
    getFavoriteExercises(user.id),
  ])
  if (!exercises.length) notFound()

  const favoriteIds = new Set(favorites.map(f => f.id))

  return (
    <main style={{ padding: '1.5rem 1.25rem 6rem', maxWidth: '520px', margin: '0 auto' }}>
      <WorkoutDay
        dayId={dayContext.id}
        completeHref={`/programs/${slug}/${week}/${day}/complete`}
        exercises={exercises}
        favoriteIds={[...favoriteIds]}
        locale={locale}
      />
    </main>
  )
}
