'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Timer from './Timer'

/** Ключ sessionStorage для збереження підходів вправи між ремаунтами */
export const SETS_STORAGE_KEY_PREFIX = 'workout_sets_'

type LogData = { hold_sets?: number[]; reps_sets?: number[]; video_url?: string; note?: string }

type Props = {
  isHold: boolean
  targetSets: number
  exerciseId: string
  onSubmit: (data: LogData) => void
}

/** Окремий компонент для одного підходу reps — власний стан вводу, підтримує редагування */
function RepsSetRow({ index, saved, onSave }: { index: number; saved?: number; onSave: (v: number) => void }) {
  const t = useTranslations('workout')
  const [editing, setEditing] = useState(saved === undefined)
  const [input, setInput] = useState(saved !== undefined ? String(saved) : '')

  function confirm() {
    const val = Number(input)
    if (val > 0) { onSave(val); setEditing(false) }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0' }}>
      <span style={{ color: '#666', minWidth: '5rem' }}>{t('set')} {index + 1}</span>
      {editing ? (
        <>
          <input
            type="number" min="1"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && confirm()}
            placeholder={t('repsPlaceholder')}
            autoFocus
            style={{ width: '6rem', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #94a3b8', fontSize: '1rem' }}
          />
          <button
            type="button"
            onClick={confirm}
            disabled={!input || Number(input) <= 0}
            style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✓
          </button>
        </>
      ) : (
        <>
          <span style={{ fontWeight: 'bold', color: '#16a34a' }}>{saved} {t('reps')}</span>
          <button
            type="button"
            onClick={() => { setInput(String(saved)); setEditing(true) }}
            style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', color: '#666', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            ✎
          </button>
        </>
      )}
    </div>
  )
}

export default function LogForm({ isHold, targetSets, exerciseId, onSubmit }: Props) {
  const t = useTranslations('workout')
  const setsKey = `${SETS_STORAGE_KEY_PREFIX}${exerciseId}`

  // Відновлюємо підходи після перемикання мови
  const [sets, setSets] = useState<(number | undefined)[]>(() => {
    if (typeof window === 'undefined') return Array(targetSets).fill(undefined)
    const stored = sessionStorage.getItem(setsKey)
    if (stored) {
      const parsed: (number | null)[] = JSON.parse(stored)
      // null → undefined для сумісності з типом
      return parsed.map(v => v ?? undefined)
    }
    return Array(targetSets).fill(undefined)
  })
  const [note, setNote] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    sessionStorage.setItem(setsKey, JSON.stringify(sets.map(v => v ?? null)))
  }, [sets, setsKey])

  function saveSet(index: number, value: number | undefined) {
    setSets(prev => prev.map((v, i) => i === index ? value : v))
  }

  const anyFilled = sets.some(v => v !== undefined)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const filled = sets.filter((v): v is number => v !== undefined)
    onSubmit({
      hold_sets: isHold ? filled : undefined,
      reps_sets: isHold ? undefined : filled,
      video_url: videoUrl.trim() || undefined,
      note: note || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '0.75rem' }}>
      <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
        {sets.map((val, i) => (
          isHold ? (
            <Timer
              key={i}
              label={`${t('set')} ${i + 1}`}
              savedValue={val}
              onSave={(secs) => saveSet(i, secs)}
              onEdit={() => saveSet(i, undefined)}
            />
          ) : (
            <RepsSetRow
              key={i}
              index={i}
              saved={val}
              onSave={(v) => saveSet(i, v)}
            />
          )
        ))}
      </div>

      <input
        type="url"
        placeholder={t('videoPlaceholder')}
        value={videoUrl}
        onChange={e => setVideoUrl(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem', boxSizing: 'border-box', fontSize: '0.9rem' }}
      />

      <textarea
        placeholder={t('notePlaceholder')}
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={2}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', resize: 'none', marginBottom: '0.5rem', boxSizing: 'border-box' }}
      />

      <button
        type="submit"
        disabled={!anyFilled}
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '8px',
          background: anyFilled ? '#3b82f6' : '#cbd5e1',
          color: '#fff', border: 'none',
          cursor: anyFilled ? 'pointer' : 'not-allowed',
          fontWeight: 'bold', fontSize: '1rem',
        }}
      >
        {t('done')}
      </button>
    </form>
  )
}
