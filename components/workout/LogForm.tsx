'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Timer from './Timer'

export const SETS_STORAGE_KEY_PREFIX = 'workout_sets_'

type LogData = { hold_sets?: number[]; reps_sets?: number[]; video_url?: string; note?: string }

type Props = {
  isHold: boolean
  targetSets: number
  exerciseId: string
  onSubmit: (data: LogData) => void
}

function RepsSetRow({ index, saved, onSave }: { index: number; saved?: number; onSave: (v: number) => void }) {
  const t = useTranslations('workout')
  const [editing, setEditing] = useState(saved === undefined)
  const [input, setInput] = useState(saved !== undefined ? String(saved) : '')

  function confirm() {
    const val = Number(input)
    if (val > 0) { onSave(val); setEditing(false) }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minHeight: '56px', borderBottom: '1px solid #1e1e1e' }}>
      <span style={{ color: '#555', width: '4.5rem', fontSize: '0.75rem', fontWeight: 500, flexShrink: 0 }}>
        {t('set')} {index + 1}
      </span>
      {editing ? (
        <>
          <input
            type="number" min="1"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && confirm()}
            onBlur={confirm}
            placeholder="0"
            autoFocus
            style={{
              flex: 1, padding: '0.55rem 0',
              border: 'none',
              borderBottom: '2px solid #39e600',
              background: 'transparent',
              color: '#fff', fontSize: '1.3rem', fontWeight: 700,
              textAlign: 'center', outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={confirm}
            disabled={!input || Number(input) <= 0}
            style={{
              width: '44px', height: '44px', borderRadius: '50%', border: 'none', flexShrink: 0,
              background: (!input || Number(input) <= 0) ? '#1e1e1e' : '#39e600',
              color: (!input || Number(input) <= 0) ? '#333' : '#000',
              cursor: (!input || Number(input) <= 0) ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
          >✓</button>
        </>
      ) : (
        <>
          <span style={{ flex: 1, fontWeight: 700, color: '#39e600', fontSize: '1.1rem', textAlign: 'center' }}>
            {saved} <span style={{ fontSize: '0.78rem', fontWeight: 500, opacity: 0.7 }}>{t('reps')}</span>
          </span>
          <button
            type="button"
            onClick={() => { setInput(String(saved)); setEditing(true) }}
            style={{
              width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              border: 'none', background: 'transparent',
              color: '#555', cursor: 'pointer', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✎</button>
        </>
      )}
    </div>
  )
}

export default function LogForm({ isHold, targetSets, exerciseId, onSubmit }: Props) {
  const t = useTranslations('workout')
  const setsKey = `${SETS_STORAGE_KEY_PREFIX}${exerciseId}`
  const [extraOpen, setExtraOpen] = useState(false)

  const [sets, setSets] = useState<(number | undefined)[]>(() => {
    if (typeof window === 'undefined') return Array(targetSets).fill(undefined)
    const stored = sessionStorage.getItem(setsKey)
    if (stored) {
      const parsed: (number | null)[] = JSON.parse(stored)
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

  const filledCount = sets.filter(v => v !== undefined).length
  const anyFilled = filledCount > 0
  const allFilled = filledCount === sets.length

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
    <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
      {/* Sets */}
      <div style={{ background: '#1a1a1a', borderRadius: '10px', padding: '0 0.75rem', marginBottom: '0.75rem' }}>
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
            <RepsSetRow key={i} index={i} saved={val} onSave={(v) => saveSet(i, v)} />
          )
        ))}
      </div>

      {/* Extra: video + note (collapsed by default) */}
      <button
        type="button"
        onClick={() => setExtraOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.6rem 0', color: '#555', fontSize: '0.82rem',
        }}
      >
        <span>{extraOpen ? t('hideExtra') : t('addNote')}</span>
        <span style={{
          display: 'inline-block', fontSize: '0.8rem', color: '#444',
          transform: extraOpen ? 'rotate(90deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
        }}>›</span>
      </button>

      {extraOpen && (
        <div style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="url"
            placeholder={t('videoPlaceholder')}
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', boxSizing: 'border-box', fontSize: '0.875rem' }}
          />
          <textarea
            placeholder={t('notePlaceholder')}
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', resize: 'none', boxSizing: 'border-box', fontSize: '0.875rem' }}
          />
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!anyFilled}
        style={{
          width: '100%', padding: '1rem', borderRadius: '12px',
          background: allFilled ? '#39e600' : anyFilled ? 'rgba(57,230,0,0.55)' : '#1a1a1a',
          color: anyFilled ? '#000' : '#444',
          border: 'none',
          cursor: anyFilled ? 'pointer' : 'not-allowed',
          fontWeight: 700, fontSize: '1rem',
          transition: 'background 0.2s ease, color 0.2s ease',
        }}
      >
        {allFilled ? t('save') : anyFilled ? `${t('save')} (${filledCount}/${sets.length})` : t('save')}
      </button>
    </form>
  )
}
