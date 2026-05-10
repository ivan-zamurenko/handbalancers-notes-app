'use client'
// Pattern: Pure Component — статистика без мутацій, обраховується з переданих даних
import { useTranslations } from 'next-intl'
import type { Exercise, WorkoutLogWithExercise } from '@/types'

type Props = {
  favorites: Exercise[]
  logs: WorkoutLogWithExercise[]
  locale: string
}

function computeStats(exerciseId: string, logs: WorkoutLogWithExercise[]) {
  const exerciseLogs = logs.filter(l => l.exercise_id === exerciseId)
  const totalSessions = exerciseLogs.length

  // Найкращий холд: максимум з усіх hold_sets
  const allHolds = exerciseLogs.flatMap(l => l.hold_sets ?? [])
  const bestHold = allHolds.length ? Math.max(...allHolds) : null

  // Середній рівень: середнє з максимумів кожної сесії (hold або reps)
  const allReps = exerciseLogs.flatMap(l => l.reps_sets ?? [])
  const avgReps = allReps.length ? Math.round(allReps.reduce((a, b) => a + b, 0) / allReps.length) : null

  return { totalSessions, bestHold, avgReps }
}

export default function ExerciseStats({ favorites, logs, locale }: Props) {
  const t = useTranslations('tracking')

  if (!favorites.length) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>{t('statsTitle')}</h2>
        <p style={{ color: '#888' }}>{t('noStats')}</p>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>{t('statsTitle')}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {favorites.map(ex => {
          const name = locale === 'en' ? ex.name_en : ex.name_ua
          const { totalSessions, bestHold, avgReps } = computeStats(ex.id, logs)
          const isHold = ex.target_hold !== null

          return (
            <div key={ex.id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.875rem',
              background: '#fff',
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>⭐ {name}</div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                <span>📅 {t('total')}: <b>{totalSessions}</b></span>
                {isHold && bestHold !== null && (
                  <span>🏆 {t('best')}: <b>{bestHold} {t('sec')}</b></span>
                )}
                {!isHold && avgReps !== null && (
                  <span>📊 {t('avg')}: <b>{avgReps} {t('reps')}</b></span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
