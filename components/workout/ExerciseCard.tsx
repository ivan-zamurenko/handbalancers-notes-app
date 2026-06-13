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
  savedSets?: number[]
  isHoldResult?: boolean
  onLog: (data: { hold_sets?: number[]; reps_sets?: number[]; video_url?: string; note?: string }) => void
  onEdit: () => void
  onToggleFavorite: () => void
}

export default function ExerciseCard({ exercise, locale, isLogged, isNewRecord, isFavorite, savedSets, isHoldResult, onLog, onEdit, onToggleFavorite }: Props) {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, color: '#fff' }}>{name}</h2>
        <button
          onClick={onToggleFavorite}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.1rem',
            lineHeight: 1,
            color: isFavorite ? '#39e600' : '#555',
            padding: 0,
            flexShrink: 0,
            marginTop: '2px',
          }}
          title={isFavorite ? t('unfavorite') : t('favorite')}
        >
          ★
        </button>
      </div>

      {description && (
        <p style={{ color: '#666', margin: '0.5rem 0 0', fontSize: '0.875rem', lineHeight: 1.5 }}>{description}</p>
      )}

      <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem' }}>
        <span style={{ color: '#555' }}>{t('target')}: </span>
        <span style={{ color: '#ccc', fontWeight: 600 }}>
          {isHold
            ? `${exercise.target_hold} ${t('sec')}`
            : `${exercise.target_sets} ${t('sets')} × ${exercise.target_reps} ${t('reps')}`
          }
        </span>
      </p>

      {youtubeId && !isLogged && (
        <div style={{ marginTop: '0.75rem', borderTop: '1px solid #1e1e1e', paddingTop: '0.75rem' }}>
          <button
            onClick={() => setVideoOpen(v => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', color: '#888', fontSize: '0.82rem', minHeight: '44px',
            }}
          >
            <span>{videoOpen ? t('hideVideo') : t('watchVideo')}</span>
            <span style={{ fontSize: '1rem', color: '#555', transform: videoOpen ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>›</span>
          </button>
          {videoOpen && (
            <div style={{ marginTop: '0.5rem', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/9' }}>
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
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {savedSets && savedSets.length > 0 && (
                <span style={{ color: '#ccc', fontSize: '0.875rem', fontWeight: 600 }}>
                  {savedSets.map((v, i) => (
                    <span key={i}>
                      {i > 0 && <span style={{ color: '#444', margin: '0 3px' }}>·</span>}
                      {v}{isHoldResult ? 'с' : ''}
                    </span>
                  ))}
                </span>
              )}
              {!savedSets?.length && (
                <span style={{ color: '#555', fontSize: '0.8rem' }}>{t('saved')}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isNewRecord && (
                <span style={{ color: '#39e600', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.03em' }}>
                  ↑ {t('newRecord')}
                </span>
              )}
              <button
                onClick={onEdit}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.8rem', padding: 0 }}
              >
                {t('edit')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <LogForm isHold={isHold} targetSets={exercise.target_sets ?? 1} exerciseId={exercise.id} onSubmit={onLog} />
      )}
    </div>
  )
}

