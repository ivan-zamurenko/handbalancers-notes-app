'use client'
import { useState, useEffect } from 'react'
import { fetchHandstandChartData, fetchExerciseChartData } from './actions'
import ProgressChart from './ProgressChart'

const PERIODS = [7, 30, 90] as const

type Period = (typeof PERIODS)[number]

interface Props {
  userId: string
  title: string
  type: 'handstand' | 'exercise'
  exerciseId?: string
  unit?: string
  height?: number
  locale: string
  emptyText: string
  emptySubText?: string
}

export default function ProgressChartWithPeriod({
  userId,
  title,
  type,
  exerciseId,
  unit,
  height = 220,
  locale,
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
        ? fetchHandstandChartData(userId, period)
        : fetchExerciseChartData(userId, exerciseId!, period)

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
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                background: period === p ? '#1e1e1e' : 'none',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '0.68rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: period === p ? '#fff' : '#444',
                letterSpacing: '0.04em',
                minHeight: '24px',
              }}
            >
              {p}{locale === 'en' ? 'd' : 'д'}
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
