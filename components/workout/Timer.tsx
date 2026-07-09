'use client'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

type TimerState = 'idle' | 'running' | 'stopped'

type Props = {
  label: string
  savedValue?: number
  onSave: (seconds: number) => void
  onEdit?: () => void
  onStart?: () => void   // сповіщає LogForm що цей таймер запустився
  isBlocked?: boolean    // інший таймер зараз активний
}

export default function Timer({ label, savedValue, onSave, onEdit, onStart, isBlocked }: Props) {
  const t = useTranslations('workout')
  const [state, setState] = useState<TimerState>('idle')
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [state])

  if (savedValue !== undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minHeight: '56px', borderBottom: '1px solid #1e1e1e' }}>
        <span style={{ color: '#888', width: '4.5rem', fontSize: '0.75rem', fontWeight: 500, flexShrink: 0 }}>{label}</span>
        <span style={{ flex: 1, fontWeight: 700, color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>{savedValue}s</span>
        <button
          type="button"
          onClick={onEdit}
          style={{
            width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
            border: 'none', background: 'transparent',
            color: '#555', cursor: 'pointer', fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✎
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minHeight: '56px', borderBottom: '1px solid #1e1e1e' }}>
      <span style={{ color: '#888', width: '4.5rem', fontSize: '0.75rem', fontWeight: 500, flexShrink: 0 }}>{label}</span>

      <span style={{ flex: 1, fontWeight: 700, fontSize: '1.3rem', textAlign: 'center' }}>
        {seconds}s
      </span>

      {state === 'idle' && (
        <button
          onClick={() => { onStart?.(); setState('running') }}
          disabled={isBlocked}
          style={{
            padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: 700, flexShrink: 0,
            background: isBlocked ? 'transparent' : 'transparent',
            border: isBlocked ? '1px solid #222' : '1px solid #2a3d1a',
            color: isBlocked ? '#333' : '#39e600',
            cursor: isBlocked ? 'not-allowed' : 'pointer',
          }}
        >
          {t('start')}
        </button>
      )}

      {state === 'running' && (
        <button
          onClick={() => setState('stopped')}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}
        >
          {t('stop')}
        </button>
      )}

      {state === 'stopped' && (
        <>
          <button
            onClick={() => onSave(seconds)}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: '#39e600', color: '#000', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}
          >
            {t('saveSet')}
          </button>
          <button
            onClick={() => { setSeconds(0); setState('idle') }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.82rem', padding: '0.4rem 0.5rem', flexShrink: 0 }}
          >
            {t('again')}
          </button>
        </>
      )}
    </div>
  )
}


