'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'

interface Day {
  id: string
  title_ua: string
  title_en: string
}

interface Week {
  id: string
  title_ua: string
  title_en: string
}

interface WeekAccordionProps {
  weeksWithDays: { week: Week; days: Day[] }[]
  completedIds: string[]
  nextDayId: string | null
  canAccess: boolean
  locale: string
  labels: {
    completed: string
    nextDay: string
    paid: string
  }
}

export default function WeekAccordion({
  weeksWithDays,
  completedIds,
  nextDayId,
  canAccess,
  locale,
  labels,
}: WeekAccordionProps) {
  const completedSet = new Set(completedIds)

  const defaultWeekId =
    (nextDayId
      ? weeksWithDays.find(({ days }) => days.some(d => d.id === nextDayId))?.week.id
      : undefined) ??
    weeksWithDays.find(({ days }) => days.some(d => !completedSet.has(d.id)))?.week.id ??
    weeksWithDays[0]?.week.id ??
    null

  const [openId, setOpenId] = useState<string | null>(defaultWeekId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {weeksWithDays.map(({ week, days }) => {
        const weekTitle = locale === 'en' ? week.title_en : week.title_ua
        const isOpen = openId === week.id
        const completedCount = days.filter(d => completedSet.has(d.id)).length
        const isCurrentWeek = days.some(d => d.id === nextDayId)
        const allDone = completedCount === days.length
        const progressColor = allDone ? '#39e600' : isCurrentWeek ? '#2979ff' : '#444'

        return (
          <div key={week.id}>
            {/* Accordion Header */}
            <button
              onClick={() => setOpenId(isOpen ? null : week.id)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                background: '#141414',
                border: `1px solid ${isOpen ? '#2a2a2a' : '#1e1e1e'}`,
                borderRadius: isOpen ? '10px 10px 0 0' : '10px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{
                  color: '#555',
                  fontSize: '0.55rem',
                  display: 'inline-block',
                  transition: 'transform 0.18s ease',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}>
                  ▶
                </span>
                <span style={{
                  color: '#888',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {weekTitle}
                </span>
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: progressColor, flexShrink: 0 }}>
                {completedCount}/{days.length}{allDone ? ' ✓' : ''}
              </span>
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div style={{
                border: '1px solid #2a2a2a',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                overflow: 'hidden',
                background: '#0d0d0d',
              }}>
                {days.map((day, idx) => {
                  const dayTitle = locale === 'en' ? day.title_en : day.title_ua
                  const isCompleted = completedSet.has(day.id)
                  const isNext = nextDayId === day.id
                  const borderTop = idx > 0 ? '1px solid #1a1a1a' : 'none'

                  if (!canAccess) {
                    return (
                      <Link
                        key={day.id}
                        href="/billing"
                        style={{
                          position: 'relative',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          borderTop,
                          textDecoration: 'none',
                          overflow: 'hidden',
                        }}
                      >
                        <span style={{ filter: 'blur(3.5px)', userSelect: 'none', color: '#333', fontSize: '0.92rem', pointerEvents: 'none' }}>
                          {dayTitle}
                        </span>
                        <span style={{ color: '#444', flexShrink: 0, marginLeft: '0.5rem', fontSize: '0.85rem' }}>🔒</span>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(13,13,13,0.65)',
                        }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#f5a623',
                            border: '1px solid #f5a623',
                            borderRadius: '999px',
                            padding: '2px 10px',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}>
                            {labels.paid}
                          </span>
                        </div>
                      </Link>
                    )
                  }

                  return (
                    <Link
                      key={day.id}
                      href={`/workout/${day.id}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        borderTop,
                        textDecoration: 'none',
                        color: 'inherit',
                        background: isNext ? 'rgba(41, 121, 255, 0.04)' : 'transparent',
                      }}
                    >
                      <span style={{ color: isCompleted ? '#555' : '#fff', fontSize: '0.92rem' }}>
                        {dayTitle}
                      </span>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: isCompleted ? '#39e600' : isNext ? '#2979ff' : 'transparent',
                        flexShrink: 0,
                        marginLeft: '0.75rem',
                      }}>
                        {isCompleted ? `✓ ${labels.completed}` : isNext ? `→ ${labels.nextDay}` : '–'}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
