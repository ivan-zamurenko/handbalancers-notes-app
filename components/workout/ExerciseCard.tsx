// Картка поточної вправи під час тренування
// Показує: назву, опис, ціль (hold X сек / X повторень), відео/gif
import type { Exercise } from '@/types'

export default function ExerciseCard({ exercise }: { exercise?: Exercise }) {
  return (
    <div>
      <h2>{exercise?.name ?? 'Вправа'}</h2>
      <p>{exercise?.description}</p>
      {/* TODO: ціль (target_hold або target_reps), відео посилання */}
    </div>
  )
}
