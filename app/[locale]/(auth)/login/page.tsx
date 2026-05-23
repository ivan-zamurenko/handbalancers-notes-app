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
      justifyContent: 'flex-start',
      background: '#0d0d0d',
      padding: '3.5rem 1.5rem 2.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '320px' }}>

        {/* Лого */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hnLogo.png"
            alt="Handbalancer's Notes"
            style={{ width: '130px', height: '130px', objectFit: 'contain', mixBlendMode: 'screen', display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* Заголовок */}
        <h1 style={{
          color: '#fff',
          fontWeight: 300,
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          textAlign: 'center',
          textTransform: 'uppercase',
          margin: '0 0 1.5rem',
        }}>
          {t('title')}
        </h1>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
            color: '#f87171',
            fontSize: '0.8rem',
            marginBottom: '1.5rem',
            letterSpacing: '0.02em',
          }}>
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            required
            style={{
              width: '100%',
              padding: '0.75rem 0',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid #333',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
              letterSpacing: '0.03em',
            }}
          />
          <input
            type="password"
            name="password"
            placeholder={t('password')}
            required
            style={{
              width: '100%',
              padding: '0.75rem 0',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid #333',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
              letterSpacing: '0.03em',
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#39e600',
              color: '#000',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginTop: '0.5rem',
            }}
          >
            {t('submit')}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#444', fontSize: '0.75rem', marginTop: '1.75rem', letterSpacing: '0.05em' }}>
          {t('noAccount')}{' '}
          <Link href="/register" style={{ color: '#39e600', fontWeight: 500, textDecoration: 'none' }}>
            {t('registerLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}
