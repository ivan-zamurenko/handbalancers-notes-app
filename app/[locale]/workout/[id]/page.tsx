import { getTranslations } from 'next-intl/server'
import Timer from '@/components/workout/Timer'
import ExerciseCard from '@/components/workout/ExerciseCard'
import LogForm from '@/components/workout/LogForm'

export default async function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id } = await params
  const t = await getTranslations('workout')

  return (
    <main>
      <h1>{t('title')} #{id}</h1>
      <Timer />
      <ExerciseCard />
      <LogForm />
    </main>
  )
}
