'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function Timer() {
  const t = useTranslations('workout')
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  // TODO: useEffect з setInterval коли running === true
  // TODO: передати фінальний час у батьківський компонент або LogForm

  return (
    <div>
      <span>{seconds}s</span>
      <button onClick={() => setRunning(!running)}>
        {running ? t('stop') : t('start')}
      </button>
    </div>
  )
}
