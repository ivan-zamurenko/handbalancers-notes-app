'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Exercise } from '@/types'
import LogForm from './LogForm'

/** Витягує YouTube video ID з повного URL */
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
      border: '1px solid #1e1e1e',
      borderRadius: '16px',
      padding: '1.25rem',
      background: '#141414',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{name}</h2>
        <button
          onClick={onToggleFavorite}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem',
            lineHeight: 1,
            color: isFavorite ? '#39e600' : '#444',
            padding: 0,
            flexShrink: 0,
          }}
          title={isFavorite ? t('unfavorite') : t('favorite')}
        >
          ★
        </button>
      </div>

      {description && <p style={{ color: '#666', margin: '0.5rem 0 0', fontSize: '0.875rem' }}>{description}</p>}

      <p style={{ margin: '0.375rem 0 0.875rem', fontSize: '0.8rem' }}>
        <span style={{ color: '#555' }}>{t('target')}: </span>
        <span style={{ color: '#ccc', fontWeight: 600 }}>
          {isHold
            ? `${exercise.target_hold} ${t('sec')}`
            : `${exercise.target_sets} ${t('sets')} × ${exercise.target_reps} ${t('reps')}`
          }
        </span>
      </p>

      {youtubeId && !isLogged && (
        <div style={{ margin: '0.5rem 0' }}>
          <button
            onClick={() => setVideoOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.82rem', padding: 0 }}
          >
            {videoOpen ? t('hideVideo') : t('watchVideo')}
          </button>
          {videoOpen && (
            <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9' }}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none', display: 'block' }}
              />
            </div>
          )}
        </div>
      )}

      {isLogged ? (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#555', fontSize: '0.8rem' }}>{t('saved')}</span>
          {isNewRecord && (
            <span style={{ color: '#39e600', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.03em' }}>
              ↑ {t('newRecord')}
            </span>
          )}
        </div>
      ) : (
        <LogForm isHold={isHold} targetSets={exercise.target_sets ?? 1} exerciseId={exercise.id} onSubmit={onLog} />
      )}
    </div>
  )
}

