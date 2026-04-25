// Таймер для hold-вправ (наприклад handstand hold)
// Запускається / зупиняється вручну
// Зберігає рекорд поточного тренування, передає значення у LogForm
'use client'
import { useState } from 'react'

export default function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  // TODO: useEffect з setInterval коли running === true
  // TODO: передати фінальний час у батьківський компонент або LogForm

  return (
    <div>
      <span>{seconds}s</span>
      <button onClick={() => setRunning(!running)}>
        {running ? 'Стоп' : 'Старт'}
      </button>
    </div>
  )
}
