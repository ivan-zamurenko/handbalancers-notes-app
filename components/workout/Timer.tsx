'use client'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

type TimerState = 'idle' | 'running' | 'stopped'

type Props = {
  label: string
  savedValue?: number
  onSave: (seconds: number) => void
  onEdit?: () => void  // скидає savedValue назовні
}

export default function Timer({ label, savedValue, onSave, onEdit }: Props) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0' }}>
        <span style={{ color: '#888', minWidth: '5rem' }}>{label}</span>
        <span style={{ fontWeight: 'bold', color: '#39e600' }}>{savedValue}s</span>
        <button
          type="button"
          onClick={onEdit}
          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.85rem', padding: '0.2rem 0.4rem' }}
        >
          ✎
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid #1a1a1a' }}>
      <span style={{ color: '#888', minWidth: '5rem' }}>{label}</span>

      <span style={{ fontWeight: 'bold', fontSize: '1.25rem', minWidth: '3.5rem' }}>
        {seconds}s
      </span>

      {state === 'idle' && (
        <button
          onClick={() => setState('running')}
          style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', background: '#39e600', color: '#000', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {t('start')}
        </button>
      )}

      {state === 'running' && (
        <button
          onClick={() => setState('stopped')}
          style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {t('stop')}
        </button>
      )}

      {state === 'stopped' && (
        <>
          <button
            onClick={() => onSave(seconds)}
            style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', background: '#39e600', color: '#000', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {t('saveSet')}
          </button>
          <button
            onClick={() => { setSeconds(0); setState('idle') }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.9rem', padding: '0.4rem 0.5rem' }}
          >
            {t('again')}
          </button>
        </>
      )}
    </div>
  )
}


