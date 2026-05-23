import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { registerAction } from '@/components/auth/RegisterForm'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const t = await getTranslations('auth.register')

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

        <form action={registerAction} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {(['name', 'email', 'password'] as const).map((field) => (
            <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t(field)}
              </label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                required
                minLength={field === 'password' ? 6 : undefined}
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
          ))}

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
          {t('hasAccount')}{' '}
          <Link href="/login" style={{ color: '#39e600', fontWeight: 700, textDecoration: 'none' }}>
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}
