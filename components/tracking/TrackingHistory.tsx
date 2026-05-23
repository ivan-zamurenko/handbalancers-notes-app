'use client'
// Pattern: Smart Component — відображає список логів з можливістю редагування

// Час (в мс) протягом якого збережений статус "Збережено" видно у списку логів
const SAVE_SUCCESS_DISPLAY_MS = 2000

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
      <div style={{ marginTop: '2rem' }}>
        <h2>{t('historyTitle')}</h2>
        <p style={{ color: '#888' }}>{t('noHistory')}</p>
      </div>
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
    setTimeout(() => setSavedId(null), SAVE_SUCCESS_DISPLAY_MS)
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>{t('historyTitle')}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {logs.map(log => {
          const isEditing = editing?.logId === log.id
          const wasSaved = savedId === log.id
          const exerciseName = locale === 'en' ? log.exercises.name_en : log.exercises.name_ua
          const record = isRecord(log, logs)

          return (
            <div key={log.id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.875rem',
              background: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{exerciseName}</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.15rem' }}>
                    {formatSets(log)}
                    {record && <span style={{ marginLeft: '0.4rem', color: '#f59e0b', fontWeight: 'bold' }}>🏆</span>}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    {formatDate(log.logged_at)}
                  </div>
                </div>
                {!isEditing && (
                  wasSaved
                    ? <span style={{ color: '#16a34a', fontSize: '0.85rem' }}>{t('updated')}</span>
                    : <button
                        onClick={() => startEdit(log)}
                        style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', color: '#64748b' }}
                      >
                        ✎ {t('edit')}
                      </button>
                )}
              </div>

              {log.note && !isEditing && (
                <p style={{ margin: '0.4rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                  📝 {log.note}
                </p>
              )}

              {log.video_url && !isEditing && (
                <a href={log.video_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', marginTop: '0.3rem', color: '#3b82f6', fontSize: '0.85rem' }}>
                  🎥 {t('video')}
                </a>
              )}

              {isEditing && editing && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {log.hold_sets?.length ? `${t('sets')} (сек)` : `${t('sets')} (повт)`}
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      {editing.sets.map((val, i) => (
                        <input
                          key={i}
                          type="number" min="1"
                          value={val}
                          onChange={e => setEditing(prev => prev ? {
                            ...prev,
                            sets: prev.sets.map((s, idx) => idx === i ? e.target.value : s)
                          } : prev)}
                          style={{ width: '4rem', padding: '0.3rem', borderRadius: '6px', border: '1px solid #ddd', textAlign: 'center' }}
                        />
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder={t('note')}
                    value={editing.note}
                    onChange={e => setEditing(prev => prev ? { ...prev, note: e.target.value } : prev)}
                    style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  />

                  <input
                    type="url"
                    placeholder={t('video')}
                    value={editing.video}
                    onChange={e => setEditing(prev => prev ? { ...prev, video: e.target.value } : prev)}
                    style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  />

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdate(log)}
                      disabled={saving}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {saving ? '...' : t('update')}
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', color: '#64748b' }}
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
    </div>
  )
}
