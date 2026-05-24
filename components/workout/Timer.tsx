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
          style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #2a2a2a', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '0.8rem' }}
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
            style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', background: '#2979ff', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {t('saveSet')}
          </button>
          <button
            onClick={() => { setSeconds(0); setState('idle') }}
            style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #2a2a2a', background: 'transparent', cursor: 'pointer', color: '#888' }}
          >
            {t('again')}
          </button>
        </>
      )}
    </div>
  )
}


