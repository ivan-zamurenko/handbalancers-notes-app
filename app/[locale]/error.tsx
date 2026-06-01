'use client'

// Pattern: Error Boundary
// Next.js вимагає 'use client' для error.tsx — він перехоплює
// runtime-помилки в дочірніх серверних компонентах цього сегменту.

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface ErrorPageProps {
  error: Error
  reset: () => void  // Next.js передає reset() — повторно рендерить сегмент
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations('error')
  const router = useRouter()

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu-1 { animation: fadeUp 0.4s ease-out 0.05s both; }
        .fu-2 { animation: fadeUp 0.4s ease-out 0.18s both; }
        .fu-3 { animation: fadeUp 0.4s ease-out 0.32s both; }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: '#0d0d0d',
        // Червонуватий відблиск — сигналізує про помилку
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,60,60,0.07) 0%, transparent 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '360px', width: '100%' }}>

          {/* Іконка помилки */}
          <div className="fu-1" style={{
            fontSize: '3.5rem',
            marginBottom: '1rem',
            lineHeight: 1,
          }}>
            ⚠️
          </div>

          {/* Заголовок */}
          <h1 className="fu-2" style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 0.5rem',
            letterSpacing: '-0.02em',
          }}>
            {t('title')}
          </h1>

          {/* Пояснення */}
          <p className="fu-2" style={{
            fontSize: '0.9rem',
            color: '#888',
            margin: '0 0 2rem',
            lineHeight: 1.5,
          }}>
            {t('description')}
          </p>

          {/* Кнопки */}
          <div className="fu-3" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* reset() — повторно запускає серверний fetch без перезавантаження сторінки */}
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                background: '#39e600',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('retry')}
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.07)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('backHome')}
            </button>
          </div>

        </div>
      </main>
    </>
  )
}
