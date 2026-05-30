'use client'
// Pattern: Smart Component — тримає спільний localLogs state для ExerciseStats і TrackingHistory
import { useState } from 'react'
import type { Exercise, WorkoutLogWithExercise } from '@/types'
import ExerciseStats from './ExerciseStats'
import TrackingHistory from './TrackingHistory'
import WorkoutHeatmap from './WorkoutHeatmap'

type Props = {
  logs: WorkoutLogWithExercise[]
  favorites: Exercise[]
  locale: string
}

export default function TrackingClient({ logs, favorites, locale }: Props) {
  const [localLogs, setLocalLogs] = useState<WorkoutLogWithExercise[]>(logs)

  return (
    <>
      <WorkoutHeatmap logs={localLogs} locale={locale} />
      <ExerciseStats favorites={favorites} logs={localLogs} locale={locale} />
      <TrackingHistory logs={localLogs} onUpdate={setLocalLogs} locale={locale} />
    </>
  )
}
