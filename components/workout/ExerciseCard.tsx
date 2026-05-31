'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Exercise } from '@/types'
import LogForm from './LogForm'

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

type Props = {
  exercise: Exercise
  locale: string
  isLogged: boolean
  isNewRecord?: boolean
  isFavorite: boolean
  onLog: (data: { hold_sets?: number[]; reps_sets?: number[]; video_url?: string; note?: string }) => void
  onToggleFavorite: () => void
}

export default function ExerciseCard({ exercise, locale, isLogged, isNewRecord, isFavorite, onLog, onToggleFavorite }: Props) {
  const t = useTranslations('workout')
  const [videoOpen, setVideoOpen] = useState(false)
  const name = locale === 'en' ? exercise.name_en : exercise.name_ua
  const description = locale === 'en' ? exercise.description_en : exercise.description_ua
  const isHold = !!exercise.target_hold
  const youtubeId = exercise.youtube_url ? getYouTubeId(exercise.youtube_url) : null

  return (
    <div style={{
      border: isLogged ? '1.5px solid rgba(57,230,0,0.4)' : '1px solid #1e1e1e',
      borderRadius: '14px',
      overflow: 'hidden',
      background: isLogged ? 'rgba(57, 230, 0, 0.04)' : '#141414',
      transition: 'border-color 0.3s ease, background 0.3s ease',
    }}>
      {/* Card header */}
      <div style={{ padding: '1rem 1rem 0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 0.3rem', fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}>{name}</h2>
            {description && <p style={{ color: '#666', margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>{description}</p>}
          </div>
          <button
            onClick={onToggleFavorite}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0.1rem', flexShrink: 0 }}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </div>

        {/* Target + video toggle row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.6rem' }}>
          <span style={{
            fontSize: '0.75rem', fontWeight: 600, color: '#39e600',
            background: 'rgba(57,230,0,0.08)', borderRadius: '6px',
            padding: '0.2rem 0.5rem',
          }}>
            {isHold
              ? `${exercise.target_hold} ${t('sec')}`
              : `${exercise.target_sets}×${exercise.target_reps} ${t('reps')}`
            }
          </span>
          {youtubeId && (
            <button
              onClick={() => setVideoOpen(v => !v)}
              style={{
                background: videoOpen ? 'rgba(57,230,0,0.12)' : 'rgba(255,255,255,0.07)',
                border: 'none',
                cursor: 'pointer',
                color: videoOpen ? '#39e600' : '#d0d0d0',
                fontSize: '0.8rem', fontWeight: 600,
                padding: '0.3rem 0.65rem',
                borderRadius: '8px', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}
            >
              <span style={{ fontSize: '0.7rem' }}>{videoOpen ? '⏸' : '▶'}</span>
              {t('watchVideo')}
            </button>
          )}
        </div>

        {videoOpen && youtubeId && (
          <div style={{ marginTop: '0.75rem', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9' }}>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none', display: 'block' }}
            />
          </div>
        )}
      </div>

      {/* Log section */}
      <div style={{ padding: '0 1rem 1rem' }}>
        {isLogged ? (
          <div style={{ paddingTop: '0.5rem' }}>
            {isNewRecord && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(255, 200, 0, 0.1)', border: '1px solid rgba(255, 200, 0, 0.4)',
                borderRadius: '999px', padding: '0.25rem 0.75rem',
                marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#ffc800',
                animation: 'prPop 0.4s ease',
              }}>
                <span>🏆</span>
                <span>{t('newRecord')}</span>
              </div>
            )}
            <p style={{ color: '#39e600', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>✓ {t('saved')}</p>
          </div>
        ) : (
          <LogForm isHold={isHold} targetSets={exercise.target_sets ?? 1} exerciseId={exercise.id} onSubmit={onLog} />
        )}
      </div>
    </div>
  )
}

