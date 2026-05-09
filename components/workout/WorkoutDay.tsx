'use client'
// Pattern: Facade — один компонент керує станом всього дня (логи, улюблені, таймер)
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { Exercise } from '@/types'
import ExerciseCard from './ExerciseCard'
import { saveLog, toggleFavoriteAction } from './actions'

type Props = {
  dayId: string
  exercises: Exercise[]
  favoriteIds: string[]
  locale: string
}

export default function WorkoutDay({ dayId, exercises, favoriteIds, locale }: Props) {
  const t = useTranslations('workout')
  const loggedKey = `workout_logged_${dayId}`

  // Відновлюємо стан після перемикання мови (sessionStorage переживає remount)
  const [logged, setLogged] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    const stored = sessionStorage.getItem(loggedKey)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  })
  const [favorites, setFavorites] = useState<Set<string>>(new Set(favoriteIds))

  useEffect(() => {
    sessionStorage.setItem(loggedKey, JSON.stringify([...logged]))
  }, [logged, loggedKey])

  const allDone = exercises.every(e => logged.has(e.id))

  const [error, setError] = useState<string | null>(null)

  async function handleLog(exerciseId: string, data: { hold_sets?: number[]; reps_sets?: number[]; video_url?: string; note?: string }) {
    setError(null)
    try {
      await saveLog({ exercise_id: exerciseId, ...data })
      sessionStorage.removeItem(`workout_sets_${exerciseId}`)
      setLogged(prev => new Set([...prev, exerciseId]))
    } catch {
      setError('Не вдалося зберегти. Спробуй ще раз.')
    }
  }

  async function handleToggleFavorite(exerciseId: string) {
    const isNowFavorite = await toggleFavoriteAction(exerciseId)
    setFavorites(prev => {
      const next = new Set(prev)
      isNowFavorite ? next.add(exerciseId) : next.delete(exerciseId)
      return next
    })
  }

  return (
    <div>
      <h1>{t('title')}</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {allDone && (
        <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
          {t('allDone')}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            locale={locale}
            isLogged={logged.has(exercise.id)}
            isFavorite={favorites.has(exercise.id)}
            onLog={(data) => handleLog(exercise.id, data)}
            onToggleFavorite={() => handleToggleFavorite(exercise.id)}
          />
        ))}
      </div>
    </div>
  )
}
