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

  const allHolds = exerciseLogs.flatMap(l => l.hold_sets ?? [])
  const bestHold = allHolds.length ? Math.max(...allHolds) : null

  const allReps = exerciseLogs.flatMap(l => l.reps_sets ?? [])
  const avgReps = allReps.length ? Math.round(allReps.reduce((a, b) => a + b, 0) / allReps.length) : null

  return { totalSessions, bestHold, avgReps }
}

/** Сума секунд handstand-вправ за сьогодні (за локальним часом). */
function computeHandstandToday(logs: WorkoutLogWithExercise[]): number {
  const today = new Date().toLocaleDateString('sv-SE')  // формат YYYY-MM-DD
  return logs
    .filter(l => l.exercises.is_handstand && l.logged_at.startsWith(today))
    .flatMap(l => l.hold_sets ?? [])
    .reduce((sum, s) => sum + s, 0)
}

export default function ExerciseStats({ favorites, logs, locale }: Props) {
  const t = useTranslations('tracking')
  const handstandSec = computeHandstandToday(logs)
  const handstandMin = Math.floor(handstandSec / 60)
  const handstandRemSec = handstandSec % 60

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>{t('statsTitle')}</h2>

      {/* Handstand-лічильник за сьогодні */}
      {handstandSec > 0 && (
        <div style={{
          background: 'rgba(57, 230, 0, 0.07)',
          border: '1px solid rgba(57, 230, 0, 0.2)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontWeight: 'bold',
          color: '#39e600',
        }}>
          🤸 {t('handstandToday')}: {handstandMin > 0 ? `${handstandMin} ${t('min')} ` : ''}{handstandRemSec} {t('sec')}
        </div>
      )}

      {!favorites.length && (
        <p style={{ color: '#888' }}>{t('noStats')}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {favorites.map(ex => {
          const name = locale === 'en' ? ex.name_en : ex.name_ua
          const { totalSessions, bestHold, avgReps } = computeStats(ex.id, logs)
          if (totalSessions === 0) return null
          const isHold = ex.target_hold !== null

          return (
            <div key={ex.id} style={{
              border: '1px solid #1e1e1e',
              borderRadius: '10px',
              padding: '0.875rem',
              background: '#141414',
            }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#fff' }}>
                ⭐ {name}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#888' }}>
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
