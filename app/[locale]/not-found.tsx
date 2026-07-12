// Pattern: Empty State
// Показується коли notFound() викликається всередині [locale] сегменту,
// або коли Next.js не знаходить відповідний маршрут.

import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function NotFoundPage() {
  const t = await getTranslations('notFound')

  return (
    <>
      {/* Анімації: fadeUp — поява елементів знизу */}
      <main style={{
        minHeight: '100vh',
        background: '#0d0d0d',
        // Тихий зелений відблиск зверху — як на сторінці завершення тренування
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(57,230,0,0.08) 0%, transparent 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '360px', width: '100%' }}>

          {/* Гімнаст перевернутий вгору ногами — "впав зі стійки" */}
          <div className="fu-1" style={{
            fontSize: '5rem',
            lineHeight: 1,
            marginBottom: '0.5rem',
            transform: 'rotate(180deg)',
            display: 'inline-block',
          }}>
            🤸
          </div>

          {/* Велика цифра 404 */}
          <div className="fu-2" style={{
            fontSize: '5rem',
            fontWeight: 900,
            color: '#39e600',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            marginBottom: '1rem',
          }}>
            404
          </div>

          {/* Тематичний підзаголовок */}
          <h1 className="fu-3" style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 0.5rem',
          }}>
            {t('subtitle')}
          </h1>

          {/* Пояснення */}
          <p className="fu-3" style={{
            fontSize: '0.9rem',
            color: '#888',
            margin: '0 0 2rem',
            lineHeight: 1.5,
          }}>
            {t('description')}
          </p>

          {/* Кнопки навігації */}
          <div className="fu-4" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              background: '#39e600',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}>
              {t('backHome')}
            </Link>

            <Link href="/programs" style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.07)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}>
              {t('browsePrograms')}
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
