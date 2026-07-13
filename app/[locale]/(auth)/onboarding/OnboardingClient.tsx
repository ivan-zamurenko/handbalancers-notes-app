'use client'
import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { onboardingAction } from './actions'

type Goal  = 'handstand' | 'flexibility' | 'strength' | 'health'
type Level = 'beginner' | 'intermediate'

const GOALS: { id: Goal; icon: string }[] = [
  { id: 'handstand',   icon: '🤸' },
  { id: 'flexibility', icon: '🧘' },
  { id: 'strength',    icon: '💪' },
  { id: 'health',      icon: '❤️' },
]

const LEVELS: { id: Level; icon: string }[] = [
  { id: 'beginner',     icon: '🌱' },
  { id: 'intermediate', icon: '🔥' },
]

const cardStyle = (isSelected: boolean) => ({
  display: 'flex', alignItems: 'center', gap: '1rem',
  padding: '1rem 1.25rem',
  background: isSelected ? 'rgba(57,230,0,0.06)' : '#141414',
  border: `1.5px solid ${isSelected ? '#39e600' : '#222'}`,
  borderRadius: '16px',
  cursor: 'pointer',
  textAlign: 'left' as const,
  transition: 'border-color 0.15s, background 0.15s',
  width: '100%',
})

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="10" fill="#39e600" />
      <path d="M6 10l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function OnboardingClient() {
  const t = useTranslations('onboarding')
  const [step,     setStep]     = useState<1 | 2>(1)
  const [goal,     setGoal]     = useState<Goal | null>(null)
  const [level,    setLevel]    = useState<Level | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleGoalSelect(g: Goal) {
    setGoal(g)
    setLevel(null)
    setStep(2)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!goal || !level) return
    const data = new FormData()
    data.set('goal', goal)
    data.set('level', level)
    startTransition(() => onboardingAction(data))
  }

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0d0d0d', padding: '2rem 1.5rem',
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

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.75rem' }}>
          {([1, 2] as const).map(n => (
            <div key={n} style={{
              width: n === step ? '20px' : '6px',
              height: '6px', borderRadius: '99px',
              background: n <= step ? '#39e600' : '#222',
              transition: 'width 0.25s, background 0.25s',
            }} />
          ))}
        </div>

        {step === 1 ? (
          /* ── Крок 1: Ціль ── */
          <>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', textAlign: 'center', margin: '0 0 0.5rem', lineHeight: 1.2 }}>
              {t('title')}
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#666', textAlign: 'center', margin: '0 0 2rem', lineHeight: 1.5 }}>
              {t('subtitle')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {GOALS.map(({ id, icon }) => (
                <button key={id} type="button" onClick={() => handleGoalSelect(id)} style={cardStyle(false)}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{t(id)}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{t(`${id}Sub` as Parameters<typeof t>[0])}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
                    <path d="M6 3l5 5-5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* ── Крок 2: Рівень ── */
          <form onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.85rem', padding: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              ← {t('back')}
            </button>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', textAlign: 'center', margin: '0 0 0.5rem', lineHeight: 1.2 }}>
              {t('levelTitle')}
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#666', textAlign: 'center', margin: '0 0 2rem', lineHeight: 1.5 }}>
              {t('levelSubtitle')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              {LEVELS.map(({ id, icon }) => {
                const isSelected = level === id
                return (
                  <button key={id} type="button" onClick={() => setLevel(id)} style={cardStyle(isSelected)}>
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{t(id)}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>{t(`${id}Sub` as Parameters<typeof t>[0])}</div>
                    </div>
                    {isSelected && <CheckIcon />}
                  </button>
                )
              })}
            </div>

            <button
              type="submit"
              disabled={!level || isPending}
              style={{
                display: 'block', width: '100%', padding: '0.95rem',
                background: level ? '#39e600' : '#1a1a1a',
                color: level ? '#000' : '#444',
                border: 'none', borderRadius: '14px',
                fontSize: '0.95rem', fontWeight: 700,
                cursor: level && !isPending ? 'pointer' : 'default',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {isPending ? '...' : t('cta')}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

