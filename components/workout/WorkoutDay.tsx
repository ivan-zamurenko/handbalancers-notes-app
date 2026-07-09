'use client'
// Pattern: Facade — один компонент керує станом всього дня (логи, улюблені, таймер)
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import type { Exercise } from '@/types'
import ExerciseCard from './ExerciseCard'
import { saveLog, updateLogAction, toggleFavoriteAction } from './actions'
import { SETS_STORAGE_KEY_PREFIX } from './LogForm'

type LogResult = {
  logId: string
  sets: number[]
  isHold: boolean
}

type WorkoutContext = {
  programTitle: string
  slug: string
  weekOrder: number
  dayOrder: number
  dayTitle: string
}

type Props = {
  dayId: string
  exercises: Exercise[]
  favoriteIds: string[]
  locale: string
  completeHref?: string
  context?: WorkoutContext
}

export default function WorkoutDay({ dayId, exercises, favoriteIds, locale, completeHref, context }: Props) {
  const t = useTranslations('workout')
  const router = useRouter()
  const today = new Date().toISOString().slice(0, 10)
  const loggedKey = `workout_logged_${dayId}_${today}`

  const [logged, setLogged] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)
  // logId + saved sets per exerciseId — для редагування
  const [logResults, setLogResults] = useState<Record<string, LogResult>>({})
  // які вправи зараз в режимі редагування
  const [editing, setEditing] = useState<Set<string>>(new Set())

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
    const isEditing = editing.has(exerciseId)
    const existingLogId = logResults[exerciseId]?.logId

    try {
      let logId: string
      let isNewRecord = false

      if (isEditing && existingLogId) {
        // Оновлюємо існуючий запис
        await updateLogAction(existingLogId, {
          hold_sets: data.hold_sets,
          reps_sets: data.reps_sets,
          note: data.note ?? null,
          video_url: data.video_url ?? null,
        })
        logId = existingLogId
        setEditing(prev => { const n = new Set(prev); n.delete(exerciseId); return n })
      } else {
        // Новий запис
        const result = await saveLog({ exercise_id: exerciseId, ...data })
        logId = result.logId
        isNewRecord = result.isNewRecord
      }

      sessionStorage.removeItem(`${SETS_STORAGE_KEY_PREFIX}${exerciseId}`)

      const sets = data.hold_sets ?? data.reps_sets ?? []
      setLogResults(prev => ({ ...prev, [exerciseId]: { logId, sets, isHold: !!data.hold_sets?.length } }))

      const newLogged = new Set([...logged, exerciseId])
      setLogged(newLogged)

      if (isNewRecord) {
        setNewRecords(prev => new Set([...prev, exerciseId]))
      }

      if (!isEditing && exercises.every(e => newLogged.has(e.id))) {
        const completeUrl = completeHref ?? `/workout/${dayId}/complete`
        setTimeout(() => router.push(completeUrl), 600)
      }
    } catch {
      setError(t('saveError'))
    }
  }

  function handleEdit(exerciseId: string) {
    setEditing(prev => new Set([...prev, exerciseId]))
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
      {/* Контекст: back link + програма/тиждень/день */}
      <div style={{ marginBottom: '1.75rem' }}>
        {context && (
          <div style={{ marginBottom: '0.75rem' }}>
            <Link
              href={`/programs/${context.slug}`}
              style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.15s' }}
            >
              <svg width="6" height="11" viewBox="0 0 6 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 1L1 5.5L5 10"/></svg>
              {context.programTitle}
            </Link>
            <p style={{ margin: '0.2rem 0 0', color: '#3a3a3a', fontSize: '0.72rem', letterSpacing: '0.04em', fontWeight: 500 }}>
              {t('weekLabel', { n: context.weekOrder })} · {t('dayLabel', { n: context.dayOrder })}
            </p>
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          {context?.dayTitle ?? t('title')}
        </h1>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            locale={locale}
            isLogged={logged.has(exercise.id) && !editing.has(exercise.id)}
            isNewRecord={newRecords.has(exercise.id)}
            isFavorite={favorites.has(exercise.id)}
            savedSets={logResults[exercise.id]?.sets}
            isHoldResult={logResults[exercise.id]?.isHold}
            onLog={(data) => handleLog(exercise.id, data)}
            onEdit={() => handleEdit(exercise.id)}
            onToggleFavorite={() => handleToggleFavorite(exercise.id)}
          />
        ))}
      </div>
    </div>
  )
}
