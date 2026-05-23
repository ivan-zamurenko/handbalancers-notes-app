import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { loginAction } from '@/components/auth/LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const t = await getTranslations('auth.login')

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0f0d',
      color: '#fff',
    }}>
      {/* Верхній accent */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, #39e600 0%, #2979ff 100%)',
      }} />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        maxWidth: '420px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Лого */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2.5rem',
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #39e600, #2979ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              HB
            </span>
            <span style={{ fontSize: '0.8rem', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Training
            </span>
          </div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            {t('title')}
          </h1>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px',
            padding: '0.875rem 1rem',
            color: '#f87171',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}>
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('email')}
            </label>
            <input
              type="email"
              name="email"
              required
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                border: '1.5px solid #1e2a22',
                background: '#111a14',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('password')}
            </label>
            <input
              type="password"
              name="password"
              required
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                border: '1.5px solid #1e2a22',
                background: '#111a14',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #39e600 0%, #2979ff 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              marginTop: '0.5rem',
            }}
          >
            {t('submit')}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#555', fontSize: '0.875rem', marginTop: '2rem' }}>
          {t('noAccount')}{' '}
          <Link href="/register" style={{ color: '#39e600', fontWeight: 700, textDecoration: 'none' }}>
            {t('registerLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}
