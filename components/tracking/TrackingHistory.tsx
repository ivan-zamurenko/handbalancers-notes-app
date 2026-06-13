'use client'
// Pattern: Smart Component — відображає список логів з можливістю редагування
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { WorkoutLogWithExercise } from '@/types'
import { updateLogAction } from '@/components/workout/actions'

type Props = {
  logs: WorkoutLogWithExercise[]
  onUpdate: (updater: (prev: WorkoutLogWithExercise[]) => WorkoutLogWithExercise[]) => void
  locale: string
}

type EditState = {
  logId: string
  sets: string[]   // рядки щоб зручно редагувати в input
  note: string
  video: string
}

function formatSets(log: WorkoutLogWithExercise): string {
  if (log.hold_sets?.length) return log.hold_sets.map(s => `${s}s`).join(' · ')
  if (log.reps_sets?.length) return log.reps_sets.map(r => `${r}`).join(' · ')
  return '—'
}

function formatDateHeader(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'ua' ? 'uk-UA' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Повертає true якщо цей лог є новим рекордом для вправи серед усіх логів. */
function isRecord(log: WorkoutLogWithExercise, allLogs: WorkoutLogWithExercise[]): boolean {
  const sameLogs = allLogs.filter(l => l.exercise_id === log.exercise_id)
  if (sameLogs.length < 2) return false  // перший результат не рекорд — немає з чим порівнювати

  const logMax = log.hold_sets?.length
    ? Math.max(...log.hold_sets)
    : log.reps_sets?.length
      ? Math.max(...log.reps_sets)
      : 0

  // Перевіряємо чи є хоча б один раніший лог з кращим або рівним результатом
  const earlier = sameLogs.filter(l => l.logged_at < log.logged_at)
  if (!earlier.length) return false

  const prevBest = Math.max(...earlier.map(l => {
    if (l.hold_sets?.length) return Math.max(...l.hold_sets)
    if (l.reps_sets?.length) return Math.max(...l.reps_sets)
    return 0
  }))

  return logMax > prevBest
}

export default function TrackingHistory({ logs, onUpdate, locale }: Props) {
  const t = useTranslations('tracking')
  const [editing, setEditing] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  if (!logs.length) {
    return (
      <p style={{ color: '#555', fontSize: '0.875rem' }}>{t('noHistory')}</p>
    )
  }

  function startEdit(log: WorkoutLogWithExercise) {
    const isHold = !!log.hold_sets?.length
    setEditing({
      logId: log.id,
      sets: (isHold ? log.hold_sets! : log.reps_sets ?? []).map(String),
      note: log.note ?? '',
      video: log.video_url ?? '',
    })
  }

  function cancelEdit() { setEditing(null) }

  async function handleUpdate(log: WorkoutLogWithExercise) {
    if (!editing) return
    setSaving(true)
    const isHold = !!log.hold_sets?.length
    const parsed = editing.sets.map(Number).filter(n => n > 0)
    await updateLogAction(editing.logId, {
      hold_sets: isHold ? parsed : undefined,
      reps_sets: isHold ? undefined : parsed,
      note: editing.note || null,
      video_url: editing.video.trim() || null,
    })
    // Оновлюємо спільний стан через батьківський callback
    onUpdate(prev => prev.map(l => l.id === editing.logId ? {
      ...l,
      hold_sets: isHold ? parsed : l.hold_sets,
      reps_sets: isHold ? l.reps_sets : parsed,
      note: editing.note || null,
      video_url: editing.video.trim() || null,
    } : l))
    setSaving(false)
    setSavedId(editing.logId)
    setEditing(null)
    setTimeout(() => setSavedId(null), 2000)
  }

  // Групуємо по даті
  const groups: { date: string; logs: WorkoutLogWithExercise[] }[] = []
  for (const log of logs) {
    const date = log.logged_at.slice(0, 10)
    const last = groups[groups.length - 1]
    if (last?.date === date) last.logs.push(log)
    else groups.push({ date, logs: [log] })
  }

  // Найновіший день відкритий за замовчуванням
  const [openDates, setOpenDates] = useState<Set<string>>(
    () => new Set(groups[0] ? [groups[0].date] : [])
  )

  function toggleDate(date: string) {
    setOpenDates(prev => {
      const next = new Set(prev)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }

  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {t('historyTitle')}
      </p>
      <div style={{ borderBottom: '1px solid #1e1e1e', marginBottom: '0.75rem' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {groups.map(({ date, logs: groupLogs }) => {
          const isOpen = openDates.has(date)
          return (
            <div key={date} style={{ border: '1px solid #1e1e1e', borderRadius: '12px', background: '#141414', overflow: 'hidden' }}>
              {/* Accordion header */}
              <button
                onClick={() => toggleDate(date)}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{formatDateHeader(date, locale)}</span>
                <span style={{ fontSize: '0.7rem', color: '#444', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
              </button>

              {/* Accordion body */}
              {isOpen && groupLogs.map((log, i) => {
                const isEditing = editing?.logId === log.id
                const wasSaved = savedId === log.id
                const exerciseName = locale === 'en' ? log.exercises.name_en : log.exercises.name_ua
                const record = isRecord(log, logs)

                return (
                  <div key={log.id} style={{ borderTop: '1px solid #1a1a1a' }}>
                    <div style={{ padding: '0.7rem 1rem', borderBottom: isEditing ? '1px solid #1a1a1a' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '0.875rem', color: '#ccc' }}>{exerciseName}</span>
                          <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#555' }}>{formatSets(log)}</span>
                          {record && <span style={{ marginLeft: '0.4rem', color: '#39e600', fontSize: '0.72rem', fontWeight: 700 }}>↑</span>}
                        </div>
                        {!isEditing && (
                          wasSaved
                            ? <span style={{ color: '#555', fontSize: '0.75rem', flexShrink: 0 }}>{t('updated')}</span>
                            : <button
                                onClick={() => startEdit(log)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: '#444', padding: '0.2rem 0', flexShrink: 0 }}
                              >
                                {t('edit')}
                              </button>
                        )}
                      </div>
                      {log.note && !isEditing && (
                        <p style={{ margin: '0.3rem 0 0', color: '#444', fontSize: '0.78rem' }}>{log.note}</p>
                      )}
                      {log.video_url && !isEditing && (
                        <a href={log.video_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'block', marginTop: '0.2rem', color: '#555', fontSize: '0.78rem', textDecoration: 'none' }}>
                          {t('video')} →
                        </a>
                      )}
                    </div>

                    {isEditing && editing && (
                      <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', color: '#555' }}>
                            {log.hold_sets?.length ? `${t('sets')} (сек)` : `${t('sets')} (повт)`}
                          </label>
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                            {editing.sets.map((val, idx) => (
                              <input
                                key={idx}
                                type="number" min="1"
                                value={val}
                                onChange={e => setEditing(prev => prev ? {
                                  ...prev,
                                  sets: prev.sets.map((s, si) => si === idx ? e.target.value : s)
                                } : prev)}
                                style={{ width: '4rem', padding: '0.3rem', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', textAlign: 'center' }}
                              />
                            ))}
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder={t('note')}
                          value={editing.note}
                          onChange={e => setEditing(prev => prev ? { ...prev, note: e.target.value } : prev)}
                          style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', fontSize: '0.875rem' }}
                        />
                        <input
                          type="url"
                          placeholder={t('video')}
                          value={editing.video}
                          onChange={e => setEditing(prev => prev ? { ...prev, video: e.target.value } : prev)}
                          style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', fontSize: '0.875rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleUpdate(log)}
                            disabled={saving}
                            style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: '#39e600', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: saving ? 0.5 : 1 }}
                          >
                            {saving ? '...' : t('update')}
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{ padding: '0.6rem 0.75rem', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#555', fontSize: '0.875rem' }}
                          >
                            {t('cancel')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
