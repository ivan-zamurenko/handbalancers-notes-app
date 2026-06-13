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

  const exercisesWithData = allExercises.filter(ex => computeStats(ex.id, logs).totalSessions > 0)
  if (!exercisesWithData.length) return null

  return (
    <div style={{ marginBottom: '2rem' }}>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {t('statsTitle')}
      </p>
      <div style={{ borderBottom: '1px solid #1e1e1e', marginBottom: '0.75rem' }} />

      {/* Exercise rows */}
      {exercisesWithData.map((ex, i) => {
        const name = locale === 'en' ? ex.name_en : ex.name_ua
        const { totalSessions, bestHold, avgReps } = computeStats(ex.id, logs)
        const isHold = ex.target_hold !== null
        const isFav = favoriteIds.has(ex.id)
        const isLast = i === exercisesWithData.length - 1

        return (
          <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: isLast ? 'none' : '1px solid #1a1a1a' }}>
            <span style={{ fontSize: '0.875rem', color: '#ccc' }}>
              {isFav && <span style={{ color: '#39e600', marginRight: '0.3rem', fontSize: '0.7rem' }}>★</span>}
              {name}
            </span>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {isHold && bestHold !== null && (
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{t('best')}: <span style={{ color: '#ccc', fontWeight: 600 }}>{bestHold} {t('sec')}</span></span>
              )}
              {!isHold && avgReps !== null && (
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{t('avg')}: <span style={{ color: '#ccc', fontWeight: 600 }}>{avgReps} {t('reps')}</span></span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
