'use client'
// Pattern: Facade — один компонент керує станом всього дня (логи, улюблені, таймер)
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/navigation'
import type { Exercise, DayFullContext } from '@/types'
import ExerciseCard from './ExerciseCard'
import { saveLog, toggleFavoriteAction } from './actions'
import { SETS_STORAGE_KEY_PREFIX } from './LogForm'

type Props = {
  dayId: string
  completeHref: string
  exercises: Exercise[]
  favoriteIds: string[]
  locale: string
  dayContext: DayFullContext | null
}

export default function WorkoutDay({ dayId, completeHref, exercises, favoriteIds, locale, dayContext }: Props) {
  const t = useTranslations('workout')
  const router = useRouter()
  const loggedKey = `workout_logged_${dayId}`

  const [logged, setLogged] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    const stored = sessionStorage.getItem(loggedKey)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  })
  const [favorites, setFavorites] = useState<Set<string>>(new Set(favoriteIds))
  const [newRecords, setNewRecords] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    sessionStorage.setItem(loggedKey, JSON.stringify([...logged]))
  }, [logged, loggedKey])

  const allDone = exercises.every(e => logged.has(e.id))
  const doneCount = exercises.filter(e => logged.has(e.id)).length

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
      if (exercises.every(e => newLogged.has(e.id))) {
        setTimeout(() => router.push(completeHref), 600)
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
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      {dayContext && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link
            href={`/programs/${dayContext.weeks.programs.slug}`}
            style={{ fontSize: '0.75rem', color: '#555', textDecoration: 'none', transition: 'color 0.15s' }}
          >
            {locale === 'en' ? dayContext.weeks.programs.title_en : dayContext.weeks.programs.title_ua}
          </Link>
          <span style={{ color: '#333', fontSize: '0.75rem' }}>›</span>
          <Link
            href={`/programs/${dayContext.weeks.programs.slug}`}
            style={{ fontSize: '0.75rem', color: '#555', textDecoration: 'none', transition: 'color 0.15s' }}
          >
            {locale === 'en' ? dayContext.weeks.title_en : dayContext.weeks.title_ua}
          </Link>
          <span style={{ color: '#333', fontSize: '0.75rem' }}>›</span>
          <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 500 }}>
            {locale === 'en' ? dayContext.title_en : dayContext.title_ua}
          </span>
        </div>
      )}

      {/* Header: title + progress */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.2 }}>
          {dayContext ? (locale === 'en' ? dayContext.title_en : dayContext.title_ua) : t('title')}
        </h1>
        <div>
          <span style={{ fontSize: '0.8rem', color: allDone ? '#39e600' : '#555', fontWeight: 500, transition: 'color 0.3s ease' }}>
            {doneCount}/{exercises.length}
          </span>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
