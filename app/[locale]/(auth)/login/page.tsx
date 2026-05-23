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
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f7',
      padding: '2rem 1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        {/* Лого */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginBottom: '1.75rem',
          }}>
            <span style={{
              fontSize: '1.375rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#1d1d1f',
            }}>
              HB
            </span>
            <span style={{ fontSize: '0.75rem', color: '#86868b', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
              Training
            </span>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            color: '#1d1d1f',
            margin: 0,
          }}>
            {t('title')}
          </h1>
        </div>

        {error && (
          <div style={{
            background: '#fff2f2',
            border: '1px solid #ffcdd2',
            borderRadius: '12px',
            padding: '0.875rem 1rem',
            color: '#c62828',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
          }}>
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            required
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              border: '1px solid #d2d2d7',
              background: '#fff',
              color: '#1d1d1f',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="password"
            name="password"
            placeholder={t('password')}
            required
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              border: '1px solid #d2d2d7',
              background: '#fff',
              color: '#1d1d1f',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9375rem',
              borderRadius: '12px',
              background: '#39e600',
              color: '#0a1a00',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              marginTop: '0.25rem',
            }}
          >
            {t('submit')}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#86868b', fontSize: '0.875rem', marginTop: '1.75rem' }}>
          {t('noAccount')}{' '}
          <Link href="/register" style={{ color: '#2979ff', fontWeight: 600, textDecoration: 'none' }}>
            {t('registerLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}
