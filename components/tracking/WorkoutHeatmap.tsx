'use client'
import { useState, useMemo } from 'react'
import type { WorkoutLogWithExercise } from '@/types'

const CELL = 11
const GAP = 3

function getColor(count: number): string {
  if (count === 0) return '#1a1a1a'
  if (count <= 2) return 'rgba(57, 230, 0, 0.2)'
  if (count <= 5) return 'rgba(57, 230, 0, 0.45)'
  if (count <= 9) return 'rgba(57, 230, 0, 0.7)'
  return '#39e600'
}

export default function WorkoutHeatmap({ logs, locale }: { logs: WorkoutLogWithExercise[]; locale: string }) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  const countByDate = useMemo(() => {
    const map: Record<string, number> = {}
    for (const log of logs) {
      const date = log.logged_at.slice(0, 10)
      map[date] = (map[date] ?? 0) + 1
    }
    return map
  }, [logs])

  const { weeks, monthLabels, totalForYear } = useMemo(() => {
    // Старт: неділя напередодні або рівно 1 січня
    const jan1 = new Date(year, 0, 1)
    const start = new Date(jan1)
    start.setDate(jan1.getDate() - jan1.getDay())

    // Завжди малюємо повний рік до 31 грудня
    const end = new Date(year, 11, 31)

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1
    const weeksCount = Math.ceil(totalDays / 7)

    const weeks: { date: string; count: number }[][] = []
    const monthLabels: { label: string; col: number }[] = []
    const cur = new Date(start)
    let lastMonth = -1
    let totalForYear = 0

    for (let w = 0; w < weeksCount; w++) {
      const week: { date: string; count: number }[] = []
      for (let d = 0; d < 7; d++) {
        const date = cur.toISOString().slice(0, 10)
        const count = countByDate[date] ?? 0
        const month = cur.getMonth()

        if (d === 0 && month !== lastMonth && cur.getFullYear() === year) {
          monthLabels.push({
            label: cur.toLocaleDateString(locale === 'ua' ? 'uk-UA' : 'en-US', { month: 'short' }),
            col: w,
          })
          lastMonth = month
        }

        if (date.startsWith(String(year))) totalForYear += count
        week.push({ date, count })
        cur.setDate(cur.getDate() + 1)
      }
      weeks.push(week)
    }

    return { weeks, monthLabels, totalForYear }
  }, [countByDate, year, locale])

  const isUa = locale === 'ua'
  const dayLabels = isUa
    ? ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const shownDayIndices = new Set([1, 3, 5])

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '0.8rem', color: '#555', margin: 0 }}>
          {totalForYear} {isUa ? 'тренувань' : 'workouts'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setYear(y => y - 1)}
            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.1rem', padding: '0 0.2rem', lineHeight: 1 }}
          >
            ‹
          </button>
          <span style={{ fontSize: '0.85rem', color: '#aaa', minWidth: '2.5rem', textAlign: 'center' }}>{year}</span>
          <button
            onClick={() => setYear(y => y + 1)}
            disabled={year >= currentYear}
            style={{ background: 'none', border: 'none', color: year >= currentYear ? '#2a2a2a' : '#555', cursor: year >= currentYear ? 'default' : 'pointer', fontSize: '1.1rem', padding: '0 0.2rem', lineHeight: 1 }}
          >
            ›
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <div style={{ display: 'inline-flex', gap: 0 }}>

          {/* Мітки днів */}
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: 6, paddingTop: 20 }}>
            {dayLabels.map((label, i) => (
              <div
                key={i}
                style={{
                  height: CELL + GAP,
                  fontSize: '0.6rem',
                  color: '#444',
                  lineHeight: `${CELL}px`,
                  visibility: shownDayIndices.has(i) ? 'visible' : 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Сітка */}
          <div>
            {/* Мітки місяців */}
            <div style={{ position: 'relative', height: 16, marginBottom: 4 }}>
              {monthLabels.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  style={{
                    position: 'absolute',
                    left: col * (CELL + GAP),
                    fontSize: '0.6rem',
                    color: '#444',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Тижні */}
            <div style={{ display: 'flex', gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                  {week.map((cell, di) => (
                    <div
                      key={`${wi}-${di}`}
                      title={cell.count > 0 ? `${cell.date}: ${cell.count}` : cell.date}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 2,
                        background: getColor(cell.count),
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Легенда — поза зоною скролу */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.6rem', color: '#444' }}>{isUa ? 'Менше' : 'Less'}</span>
        {[0, 2, 4, 7, 11].map(n => (
          <div key={n} style={{ width: CELL, height: CELL, borderRadius: 2, background: getColor(n) }} />
        ))}
        <span style={{ fontSize: '0.6rem', color: '#444' }}>{isUa ? 'Більше' : 'More'}</span>
      </div>
    </div>
  )
}
