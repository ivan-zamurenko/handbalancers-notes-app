'use client'
// Pattern: Smart Component — історія логів, згрупована по даті

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
  sets: string[]
  note: string
  video: string
}

function formatSets(log: WorkoutLogWithExercise): string {
  if (log.hold_sets?.length) return log.hold_sets.map(s => `${s}s`).join(' · ')
  if (log.reps_sets?.length) return log.reps_sets.join(' · ')
  return '—'
}

function toLocalDateStr(iso: string): string {
  // Беремо дату з ISO рядка без конвертації UTC
  return iso.slice(0, 10)
}

function formatDateLabel(dateStr: string, locale: string): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const yest = new Date(now); yest.setDate(now.getDate() - 1)
  const yesterdayStr = `${yest.getFullYear()}-${pad(yest.getMonth() + 1)}-${pad(yest.getDate())}`

  if (dateStr === todayStr) return locale === 'en' ? 'Today' : 'Сьогодні'
  if (dateStr === yesterdayStr) return locale === 'en' ? 'Yesterday' : 'Вчора'
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString(
    locale === 'ua' ? 'uk-UA' : 'en-US',
    { day: 'numeric', month: 'long' }
  )
}

function getProgramName(log: WorkoutLogWithExercise, locale: string): string | null {
  const p = log.exercises.days?.weeks?.programs
  if (!p) return null
  return locale === 'en' ? p.title_en : p.title_ua
}

function groupByProgram(
  dayLogs: WorkoutLogWithExercise[],
  locale: string,
): { programName: string | null; logs: WorkoutLogWithExercise[] }[] {
  const map = new Map<string, WorkoutLogWithExercise[]>()
  for (const log of dayLogs) {
    const key = getProgramName(log, locale) ?? '__unknown__'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(log)
  }
  return [...map.entries()].map(([key, logs]) => ({
    programName: key === '__unknown__' ? null : key,
    logs,
  }))
}

function groupByDate(logs: WorkoutLogWithExercise[]): { dateStr: string; dayLogs: WorkoutLogWithExercise[] }[] {
  const map = new Map<string, WorkoutLogWithExercise[]>()
  for (const log of logs) {
    const key = toLocalDateStr(log.logged_at)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(log)
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dateStr, dayLogs]) => ({ dateStr, dayLogs }))
}

function isRecord(log: WorkoutLogWithExercise, allLogs: WorkoutLogWithExercise[]): boolean {
  const same = allLogs.filter(l => l.exercise_id === log.exercise_id)
  if (same.length < 2) return false
  const logMax = log.hold_sets?.length
    ? Math.max(...log.hold_sets)
    : log.reps_sets?.length ? Math.max(...log.reps_sets) : 0
  const earlier = same.filter(l => l.logged_at < log.logged_at)
  if (!earlier.length) return false
  const prevBest = Math.max(...earlier.map(l => {
    if (l.hold_sets?.length) return Math.max(...l.hold_sets)
    if (l.reps_sets?.length) return Math.max(...l.reps_sets)
    return 0
  }))
  return logMax > prevBest
}

/** Дати що відкриті за замовчуванням — сьогодні і вчора */
function defaultOpenDates(groups: { dateStr: string }[]): Set<string> {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const yest = new Date(now); yest.setDate(now.getDate() - 1)
  const yesterdayStr = `${yest.getFullYear()}-${pad(yest.getMonth() + 1)}-${pad(yest.getDate())}`
  return new Set(groups.map(g => g.dateStr).filter(d => d === todayStr || d === yesterdayStr))
}

export default function TrackingHistory({ logs, onUpdate, locale }: Props) {
  const t = useTranslations('tracking')
  const [editing, setEditing] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const groups = groupByDate(logs)
  const [openDates, setOpenDates] = useState<Set<string>>(() => defaultOpenDates(groups))

  function toggleDate(dateStr: string) {
    setOpenDates(prev => {
      const next = new Set(prev)
      next.has(dateStr) ? next.delete(dateStr) : next.add(dateStr)
      return next
    })
  }

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {groups.map(({ dateStr, dayLogs }) => {
          const isOpen = openDates.has(dateStr)
          return (
          <div key={dateStr}>
            {/* Заголовок-акордеон */}
            <button
              onClick={() => toggleDate(dateStr)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0.25rem',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #1a1a1a',
                cursor: 'pointer',
                marginBottom: isOpen ? '0.35rem' : 0,
              }}
            >
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isOpen ? '#888' : '#444',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}>
                {formatDateLabel(dateStr, locale)}
                <span style={{ marginLeft: '0.4rem', color: '#333', fontWeight: 400 }}>
                  ({dayLogs.length})
                </span>
              </span>
              <span style={{ color: '#333', fontSize: '0.7rem', transition: 'transform 0.15s' }}>
                {isOpen ? '▾' : '▸'}
              </span>
            </button>

            {/* Компактні рядки — видимі тільки якщо відкрито */}
            {isOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.5rem' }}>
                {(() => {
                  const programGroups = groupByProgram(dayLogs, locale)
                  const multiProgram = programGroups.length > 1
                  return programGroups.map(({ programName, logs: groupLogs }) => (
                    <div key={programName ?? '__unknown__'}>
                      {multiProgram && programName && (
                        <div style={{ fontSize: '0.65rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, padding: '0.4rem 0.6rem 0.05rem', marginTop: '0.15rem' }}>
                          {programName}
                        </div>
                      )}
                      {groupLogs.map(log => {
                const isEditing = editing?.logId === log.id
                const wasSaved = savedId === log.id
                const exerciseName = locale === 'en' ? log.exercises.name_en : log.exercises.name_ua
                const record = isRecord(log, logs)

                return (
                  <div key={log.id}>
                    {/* Компактний рядок */}
                    {!isEditing && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.45rem 0.6rem',
                        borderRadius: '7px',
                        gap: '0.5rem',
                        background: 'transparent',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#111')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ fontSize: '0.88rem', color: '#ccc', flex: '0 0 auto', maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {exerciseName}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: '#555', flex: 1 }}>
                          {formatSets(log)}
                          {record && <span style={{ marginLeft: '0.35rem' }}>🏆</span>}
                        </span>
                        {log.note && (
                          <span title={log.note} style={{ fontSize: '0.8rem', color: '#333', cursor: 'default' }}>📝</span>
                        )}
                        {log.video_url && (
                          <a href={log.video_url} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: '0.8rem', color: '#2979ff', textDecoration: 'none' }}>🎥</a>
                        )}
                        {wasSaved
                          ? <span style={{ color: '#39e600', fontSize: '0.78rem', flexShrink: 0 }}>{t('updated')}</span>
                          : <button
                              onClick={() => startEdit(log)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontSize: '0.9rem', flexShrink: 0, padding: '0.1rem 0.2rem', lineHeight: 1 }}
                            >✎</button>
                        }
                      </div>
                    )}

                    {/* Форма редагування — розкривається на місці */}
                    {isEditing && editing && (
                      <div style={{
                        border: '1px solid #2a2a2a',
                        borderRadius: '8px',
                        padding: '0.875rem',
                        background: '#141414',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        marginBottom: '0.2rem',
                      }}>
                        <div style={{ fontSize: '0.88rem', color: '#ccc', fontWeight: 600 }}>{exerciseName}</div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '0.25rem' }}>
                            {log.hold_sets?.length ? `${t('sets')} (сек)` : `${t('sets')} (повт)`}
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {editing.sets.map((val, i) => (
                              <input
                                key={i}
                                type="number" min="1"
                                value={val}
                                onChange={e => setEditing(prev => prev ? {
                                  ...prev,
                                  sets: prev.sets.map((s, idx) => idx === i ? e.target.value : s)
                                } : prev)}
                                style={{ width: '4rem', padding: '0.3rem', borderRadius: '6px', border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', textAlign: 'center' }}
                              />
                            ))}
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder={t('note')}
                          value={editing.note}
                          onChange={e => setEditing(prev => prev ? { ...prev, note: e.target.value } : prev)}
                          style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', fontSize: '0.88rem' }}
                        />
                        <input
                          type="url"
                          placeholder={t('video')}
                          value={editing.video}
                          onChange={e => setEditing(prev => prev ? { ...prev, video: e.target.value } : prev)}
                          style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', fontSize: '0.88rem' }}
                        />

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleUpdate(log)}
                            disabled={saving}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: '#39e600', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                          >
                            {saving ? '...' : t('update')}
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #2a2a2a', background: 'transparent', cursor: 'pointer', color: '#888' }}
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
                  ))
                })()}
            </div>
            )}
          </div>
          )
        })}
      </div>
    </div>
  )
}
