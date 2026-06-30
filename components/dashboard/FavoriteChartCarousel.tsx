'use client'
import { useState } from 'react'
import type { Exercise } from '@/types'
import ProgressChartWithPeriod from './ProgressChartWithPeriod'

interface Props {
  exercises: Exercise[]
  userId: string
  locale: string
  emptyText: string
  noFavoritesText: string
}

export default function FavoriteChartCarousel({ exercises, userId, locale, emptyText, noFavoritesText }: Props) {
  const [selectedId, setSelectedId] = useState<string>(exercises[0]?.id ?? '')

  if (exercises.length === 0) {
    return (
      <div style={{ opacity: 0.4, userSelect: 'none', pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1.5px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: '0.85rem', flexShrink: 0 }}>★</div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#444', lineHeight: 1.4 }}>{noFavoritesText}</p>
      </div>
    )
  }

  const selected = exercises.find(e => e.id === selectedId) ?? exercises[0]
  const name = locale === 'en' ? selected.name_en : selected.name_ua

  return (
    <div>
      {/* Таб-перемикач */}
      {exercises.length > 1 && (
        <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
          {exercises.map(ex => {
            const label = locale === 'en' ? ex.name_en : ex.name_ua
            const isActive = ex.id === selectedId
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedId(ex.id)}
                style={{
                  background: isActive ? '#1e1e1e' : 'none',
                  border: isActive ? '1px solid #2a2a2a' : '1px solid transparent',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : '#555',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Графік вибраної вправи */}
      <ProgressChartWithPeriod
        userId={userId}
        title={name}
        type="exercise"
        exerciseId={selected.id}
        unit={selected.target_hold != null ? (locale === 'en' ? 's' : 'с') : undefined}
        height={260}
        locale={locale}
        emptyText={emptyText}
      />
    </div>
  )
}
