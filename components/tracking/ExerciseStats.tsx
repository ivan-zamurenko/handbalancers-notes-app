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

  // Унікальні вправи з логів — favorites першими, потім решта
  const favoriteIds = new Set(favorites.map(f => f.id))
  const allExercises: { id: string; name_ua: string; name_en: string; target_hold: number | null }[] = []
  const seen = new Set<string>()

  // 1. Улюблені першими (зберігаємо порядок)
  for (const fav of favorites) {
    if (!seen.has(fav.id)) {
      allExercises.push(fav)
      seen.add(fav.id)
    }
  }
  // 2. Решта — з логів
  for (const log of logs) {
    if (!seen.has(log.exercise_id)) {
      allExercises.push({
        id: log.exercise_id,
        name_ua: log.exercises.name_ua,
        name_en: log.exercises.name_en,
        target_hold: log.hold_sets?.length ? 1 : null,  // визначаємо тип по наявності hold_sets
      })
      seen.add(log.exercise_id)
    }
  }

  const handstandSec = computeHandstandToday(logs)
  const handstandMin = Math.floor(handstandSec / 60)
  const handstandRemSec = handstandSec % 60

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>{t('statsTitle')}</h2>

      {/* Handstand-лічильник за сьогодні */}
      {handstandSec > 0 && (
        <div style={{
          background: 'rgba(57,230,0,0.07)',
          borderRadius: '12px',
          padding: '0.875rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.875rem',
          color: '#39e600',
          fontWeight: 600,
        }}>
          {t('handstandToday')}: {handstandMin > 0 ? `${handstandMin} ${t('min')} ` : ''}{handstandRemSec} {t('sec')}
        </div>
      )}

      {!allExercises.length && (
        <p style={{ color: '#888' }}>{t('noStats')}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {allExercises.map(ex => {
          const name = locale === 'en' ? ex.name_en : ex.name_ua
          const { totalSessions, bestHold, avgReps } = computeStats(ex.id, logs)
          if (totalSessions === 0) return null
          const isHold = ex.target_hold !== null
          const isFav = favoriteIds.has(ex.id)

          return (
            <div key={ex.id} style={{
              border: '1px solid #1e1e1e',
              borderRadius: '12px',
              padding: '1rem',
              background: '#141414',
            }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem', color: '#fff' }}>
                {isFav && <span style={{ color: '#39e600', marginRight: '0.4rem', fontSize: '0.8rem' }}>★</span>}
                {name}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#555' }}>{t('total')}: <span style={{ color: '#888', fontWeight: 600 }}>{totalSessions}</span></span>
                {isHold && bestHold !== null && (
                  <span style={{ color: '#555' }}>{t('best')}: <span style={{ color: '#ccc', fontWeight: 600 }}>{bestHold} {t('sec')}</span></span>
                )}
                {!isHold && avgReps !== null && (
                  <span style={{ color: '#555' }}>{t('avg')}: <span style={{ color: '#ccc', fontWeight: 600 }}>{avgReps} {t('reps')}</span></span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
