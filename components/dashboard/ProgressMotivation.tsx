// Pattern: Dumb Component — мотиваційна візуалізація для нових юзерів (< 5 тренувань)
// Показує порівняльний графік: щоденні тренування vs 2x на тиждень
'use client'
import { useTranslations } from 'next-intl'

export default function ProgressMotivation() {
  const t = useTranslations('dashboard')

  return (
    <section style={{
      background: '#0f0f0f',
      border: '1px solid #1a1a1a',
      borderRadius: '20px',
      padding: '1.25rem 1.25rem 1rem',
      marginBottom: '3.5rem',
    }}>
      {/* Заголовок */}
      <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', color: '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {t('motivationEyebrow')}
      </p>
      <h3 style={{ margin: '0 0 1.1rem', fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
        {t('motivationTitle')}
      </h3>

      {/* SVG Графік */}
      <div style={{ position: 'relative' }}>
        <svg viewBox="0 0 300 110" style={{ width: '100%', overflow: 'visible' }}>

          {/* Сітка (subtle) */}
          {[25, 50, 75].map(y => (
            <line key={y} x1="10" y1={y} x2="290" y2={y}
              stroke="#1e1e1e" strokeWidth="1" />
          ))}

          {/* Мітки тижнів */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((w, i) => (
            <text key={w} x={10 + i * 40} y="108"
              fontSize="8" fill="#333" textAnchor="middle">
              {w}
            </text>
          ))}
          <text x="160" y="118" fontSize="8" fill="#333" textAnchor="middle">
            {t('motivationWeeks')}
          </text>

          {/* Крива: 2x/тиж (сіра) */}
          <path
            d="M 10,95 C 80,93 200,72 290,52"
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Крива: щодня (зелена, анімована) */}
          <path
            d="M 10,95 C 80,92 160,40 290,10"
            fill="none"
            stroke="#39e600"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="360"
            strokeDashoffset="360"
            style={{ animation: 'drawLine 1.4s cubic-bezier(0.4,0,0.2,1) 0.3s forwards' }}
          />

          {/* Мітка цілі на зеленій кривій (≈ тиждень 5) */}
          <circle cx="165" cy="52" r="4" fill="#39e600"
            style={{ animation: 'drawLine 0.01s 1.5s forwards', strokeDasharray: 1, strokeDashoffset: 0, opacity: 0 }}
          />
          {/* Вертикальна пунктирна лінія на тижні 5 */}
          <line x1="165" y1="20" x2="165" y2="95"
            stroke="#39e600" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />

          {/* Підписи кривих */}
          <text x="293" y="13" fontSize="8.5" fill="#39e600" dominantBaseline="middle" fontWeight="700">
            {t('motivationDaily')}
          </text>
          <text x="293" y="55" fontSize="8.5" fill="#333" dominantBaseline="middle">
            {t('motivationSlow')}
          </text>

          {/* Мітка "Твоя ціль" */}
          <text x="169" y="46" fontSize="8" fill="#39e600" opacity="0.7">
            {t('motivationGoal')}
          </text>
        </svg>
      </div>

      {/* Підпис */}
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: '#333', lineHeight: 1.4 }}>
        {t('motivationCaption')}
      </p>
    </section>
  )
}
