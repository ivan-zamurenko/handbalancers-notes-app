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
  completeHref?: string
}

export default function WorkoutDay({ dayId, exercises, favoriteIds, locale, completeHref }: Props) {
  const t = useTranslations('workout')
  const router = useRouter()
  const loggedKey = `workout_logged_${dayId}`

  // Відновлюємо стан після перемикання мови (sessionStorage переживає remount).
  // Починаємо з empty Set (SSR-сумісно), потім гідруємо з sessionStorage після mount.
  const [logged, setLogged] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(loggedKey)
    if (stored) {
      setLogged(new Set(JSON.parse(stored) as string[]))
    }
    setHydrated(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (hydrated) {
      sessionStorage.setItem(loggedKey, JSON.stringify([...logged]))
    }
  }, [logged, loggedKey, hydrated])

  const [favorites, setFavorites] = useState<Set<string>>(new Set(favoriteIds))
  const [newRecords, setNewRecords] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  async function handleLog(exerciseId: string, data: { hold_sets?: number[]; reps_sets?: number[]; video_url?: string; note?: string }) {
    setError(null)
    try {
      const { isNewRecord } = await saveLog({ exercise_id: exerciseId, ...data })
      sessionStorage.removeItem(`${SETS_STORAGE_KEY_PREFIX}${exerciseId}`)
      const newLogged = new Set([...logged, exerciseId])
      setLogged(newLogged)
      if (isNewRecord) {
        setNewRecords(prev => new Set([...prev, exerciseId]))
      }
      // Якщо всі вправи залоговані — переходимо на celebration screen
      if (exercises.every(e => newLogged.has(e.id))) {
        const completeUrl = completeHref ?? `/workout/${dayId}/complete`
        setTimeout(() => router.push(completeUrl), 600)
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

  const allDone = exercises.every(e => logged.has(e.id))

  return (
    <div>
      <h1 style={{ margin: '0 0 1.75rem', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{t('title')}</h1>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {allDone && (
        <p style={{ color: '#555', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          {t('allDone')}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            locale={locale}
            isLogged={logged.has(exercise.id)}
            isNewRecord={newRecords.has(exercise.id)}
            isFavorite={favorites.has(exercise.id)}
            onLog={(data) => handleLog(exercise.id, data)}
            onToggleFavorite={() => handleToggleFavorite(exercise.id)}
          />
        ))}
      </div>
    </div>
  )
}
