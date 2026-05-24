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
  isFavorite: boolean
  onLog: (data: { hold_sets?: number[]; reps_sets?: number[]; video_url?: string; note?: string }) => void
  onToggleFavorite: () => void
}

export default function ExerciseCard({ exercise, locale, isLogged, isFavorite, onLog, onToggleFavorite }: Props) {
  const t = useTranslations('workout')
  const [videoOpen, setVideoOpen] = useState(false)
  const name = locale === 'en' ? exercise.name_en : exercise.name_ua
  const description = locale === 'en' ? exercise.description_en : exercise.description_ua
  const isHold = !!exercise.target_hold
  const youtubeId = exercise.youtube_url ? getYouTubeId(exercise.youtube_url) : null

  return (
    <div style={{
      border: isLogged ? '2px solid #39e600' : '1px solid #1e1e1e',
      borderRadius: '12px',
      padding: '1rem',
      background: isLogged ? 'rgba(57, 230, 0, 0.06)' : '#141414',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{name}</h2>
        <button
          onClick={onToggleFavorite}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
          title={isFavorite ? t('unfavorite') : t('favorite')}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {description && <p style={{ color: '#888', margin: '0.5rem 0' }}>{description}</p>}

      <p style={{ fontSize: '0.875rem', color: '#888', margin: '0.25rem 0' }}>
        {t('target')}: {isHold
          ? `${exercise.target_hold} ${t('sec')}`
          : `${exercise.target_sets} ${t('sets')} × ${exercise.target_reps} ${t('reps')}`
        }
      </p>

      {youtubeId && (
        <div style={{ margin: '0.5rem 0' }}>
          <button
            onClick={() => setVideoOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2979ff', fontSize: '0.875rem', padding: 0 }}
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
        <p style={{ color: '#39e600', fontWeight: 'bold', margin: '0.5rem 0' }}>{t('saved')}</p>
      ) : (
        <LogForm isHold={isHold} targetSets={exercise.target_sets ?? 1} exerciseId={exercise.id} onSubmit={onLog} />
      )}
    </div>
  )
}

