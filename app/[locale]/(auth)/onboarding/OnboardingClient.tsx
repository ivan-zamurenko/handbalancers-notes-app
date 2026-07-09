'use client'
import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { onboardingAction } from './actions'

type Goal = 'handstand' | 'flexibility' | 'strength' | 'health'

const GOALS: { id: Goal; icon: string }[] = [
  { id: 'handstand',   icon: '🤸' },
  { id: 'flexibility', icon: '🧘' },
  { id: 'strength',    icon: '💪' },
  { id: 'health',      icon: '❤️' },
]

export default function OnboardingClient() {
  const t = useTranslations('onboarding')
  const [selected, setSelected] = useState<Goal | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selected) return
    const data = new FormData()
    data.set('goal', selected)
    startTransition(() => onboardingAction(data))
  }

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d0d0d',
      padding: '2rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Лого */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: '#39e600', color: '#000',
            margin: '0 auto 0.75rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 900,
          }}>
            HS
          </div>
        </div>

        {/* Заголовок */}
        <h1 style={{
          fontSize: '1.6rem', fontWeight: 800, color: '#fff',
          textAlign: 'center', margin: '0 0 0.5rem', lineHeight: 1.2,
        }}>
          {t('title')}
        </h1>
        <p style={{
          fontSize: '0.875rem', color: '#666', textAlign: 'center',
          margin: '0 0 2rem', lineHeight: 1.5,
        }}>
          {t('subtitle')}
        </p>

        {/* Вибір цілі */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {GOALS.map(({ id, icon }) => {
              const isSelected = selected === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelected(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: isSelected ? 'rgba(57,230,0,0.06)' : '#141414',
                    border: `1.5px solid ${isSelected ? '#39e600' : '#222'}`,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s, background 0.15s',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                      {t(id)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {t(`${id}Sub` as Parameters<typeof t>[0])}
                    </div>
                  </div>
                  {isSelected && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="10" cy="10" r="10" fill="#39e600" />
                      <path d="M6 10l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>

          <button
            type="submit"
            disabled={!selected || isPending}
            style={{
              display: 'block', width: '100%',
              padding: '0.95rem',
              background: selected ? '#39e600' : '#1a1a1a',
              color: selected ? '#000' : '#444',
              border: 'none', borderRadius: '14px',
              fontSize: '0.95rem', fontWeight: 700,
              cursor: selected && !isPending ? 'pointer' : 'default',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {isPending ? '...' : t('cta')}
          </button>
        </form>
      </div>
    </main>
  )
}
