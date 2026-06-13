'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import ProgressChart from './ProgressChart'

// Supabase клієнт — один на весь модуль, не створюємо при кожному fetch
const supabase = createClient()

const PERIODS = [
  { label: '7д', value: 7 },
  { label: '30д', value: 30 },
  { label: '90д', value: 90 },
] as const

type Period = (typeof PERIODS)[number]['value']

interface Props {
  userId: string
  title: string
  type: 'handstand' | 'exercise'
  exerciseId?: string
  unit?: string
  height?: number
  emptyText: string
  emptySubText?: string
}

async function fetchHandstandData(userId: string, days: number): Promise<{ date: string; value: number }[]> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString()

  // Один запит з JOIN — exercises!inner фільтрує тільки is_handstand=true
  const { data } = await supabase
    .from('workout_logs')
    .select('logged_at, hold_sets, exercises!inner(is_handstand)')
    .eq('user_id', userId)
    .eq('exercises.is_handstand', true)
    .not('hold_sets', 'is', null)
    .gte('logged_at', since)
    .order('logged_at', { ascending: true })

  if (!data?.length) return []

  const grouped: Record<string, number[]> = {}
  for (const r of data) {
    if (!(r.hold_sets as number[] | null)?.length) continue
    const date = (r.logged_at as string).slice(0, 10)
    grouped[date] ??= []
    grouped[date].push(Math.max(...r.hold_sets as number[]))
  }

  return Object.entries(grouped).map(([date, values]) => ({ date, value: Math.max(...values) }))
}

async function fetchExerciseData(userId: string, exerciseId: string, days: number): Promise<{ date: string; value: number }[]> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString()

  const { data } = await supabase
    .from('workout_logs')
    .select('logged_at, hold_sets, reps_sets')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .gte('logged_at', since)
    .order('logged_at', { ascending: true })

  if (!data?.length) return []

  const grouped: Record<string, number[]> = {}
  let isHold = false
  for (const r of data) {
    const date = (r.logged_at as string).slice(0, 10)
    grouped[date] ??= []
    if ((r.hold_sets as number[] | null)?.length) {
      isHold = true
      grouped[date].push(Math.max(...r.hold_sets as number[]))
    } else if ((r.reps_sets as number[] | null)?.length) {
      const sets = r.reps_sets as number[]
      grouped[date].push(Math.round(sets.reduce((a, b) => a + b, 0) / sets.length))
    }
  }

  const aggregate = (nums: number[]) =>
    isHold ? Math.max(...nums) : Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)

  return Object.entries(grouped).map(([date, values]) => ({ date, value: aggregate(values) }))
}

export default function ProgressChartWithPeriod({
  userId,
  title,
  type,
  exerciseId,
  unit,
  height = 220,
  emptyText,
  emptySubText,
}: Props) {
  const [period, setPeriod] = useState<Period>(30)
  const [data, setData] = useState<{ date: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const promise =
      type === 'handstand'
        ? fetchHandstandData(userId, period)
        : fetchExerciseData(userId, exerciseId!, period)

    promise.then(d => {
      setData(d)
      setLoading(false)
    })
  }, [userId, type, exerciseId, period])

  const innerHeight = height - 32

  return (
    <div>
      {/* Заголовок + перемикач в один рядок */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '55%' }}>
          {title}
        </h2>
        <div style={{ display: 'flex', gap: '0.125rem', flexShrink: 0 }}>
          {PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              style={{
                background: period === p.value ? '#1e1e1e' : 'none',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '0.68rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: period === p.value ? '#fff' : '#444',
                letterSpacing: '0.04em',
                minHeight: '24px',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ height: innerHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '18px',
            height: '18px',
            border: '2px solid #2a2a2a',
            borderTopColor: '#39e600',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      ) : data.length === 0 ? (
        <div style={{ height: innerHeight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{emptyText}</p>
          {emptySubText && <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>{emptySubText}</p>}
        </div>
      ) : (
        <ProgressChart data={data} height={innerHeight} unit={unit} />
      )}
    </div>
  )
}
