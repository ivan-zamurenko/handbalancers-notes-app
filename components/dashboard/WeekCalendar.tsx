// Pattern: Dumb Component — 7-денний міні-календар поточного тижня
// Показує які дні мали тренування (незалежно від програми)

type Props = {
  /** ISO-рядки дат виконаних тренувань (будь-які програми) */
  completedDates: string[]
}

/** Назви днів тижня (Пн–Нд), індекс 0 = понеділок */
const WEEKDAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

/** Повертає YYYY-MM-DD рядок для локального дня (без зсуву UTC). */
function toLocalDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Повертає масив 7 дат: поточний тиждень від Пн до Нд. */
function getCurrentWeekDates(): Date[] {
  const today = new Date()
  const dayOfWeek = today.getDay()                    // 0 = неділя
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default function WeekCalendar({ completedDates }: Props) {
  const completedSet = new Set(completedDates.map(d => d.slice(0, 10)))  // беремо тільки YYYY-MM-DD
  const today = toLocalDate(new Date())
  const weekDates = getCurrentWeekDates()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
      {weekDates.map((date, i) => {
        const dateStr = toLocalDate(date)
        const isToday = dateStr === today
        const isDone = completedSet.has(dateStr)
        const isPast = dateStr < today

        return (
          <div
            key={dateStr}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: isToday ? '#fff' : '#555', fontWeight: isToday ? 700 : 400 }}>
              {WEEKDAY_SHORT[i]}
            </span>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                background: isDone ? '#39e600' : 'transparent',
                border: isDone ? 'none' : isToday ? '2px solid #fff' : isPast ? '1px solid #2a2a2a' : '1px dashed #333',
                color: isDone ? '#000' : isToday ? '#fff' : '#333',
              }}
            >
              {isDone ? '✓' : ''}
            </div>
          </div>
        )
      })}
    </div>
  )
}
