'use client'
// Pattern: Facade — один компонент керує станом всього дня (логи, улюблені, таймер)
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import type { Exercise } from '@/types'
import ExerciseCard from './ExerciseCard'
import { saveLog, toggleFavoriteAction } from './actions'
import { SETS_STORAGE_KEY_PREFIX } from './LogForm'

type Props = {
  dayId: string
  exercises: Exercise[]
  favoriteIds: string[]
  locale: string
}

export default function WorkoutDay({ dayId, exercises, favoriteIds, locale }: Props) {
  const t = useTranslations('workout')
  const router = useRouter()
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
      sessionStorage.removeItem(`${SETS_STORAGE_KEY_PREFIX}${exerciseId}`)
      const newLogged = new Set([...logged, exerciseId])
      setLogged(newLogged)
      // Якщо всі вправи залоговані — переходимо на celebration screen
      if (exercises.every(e => newLogged.has(e.id))) {
        setTimeout(() => router.push(`/workout/${dayId}/complete`), 600)
      }
    } catch {
      setError(t('saveError'))
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
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {allDone && (
        <div style={{ background: 'rgba(57, 230, 0, 0.07)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#39e600' }}>
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
