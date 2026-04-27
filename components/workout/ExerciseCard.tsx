'use client'
import { useTranslations } from 'next-intl'
import type { Exercise } from '@/types'

export default function ExerciseCard({ exercise }: { exercise?: Exercise }) {
  const t = useTranslations('workout')
  return (
    <div>
      <h2>{exercise?.name ?? t('defaultExercise')}</h2>
      <p>{exercise?.description}</p>
      {/* TODO: ціль (target_hold або target_reps), відео посилання */}
    </div>
  )
}
