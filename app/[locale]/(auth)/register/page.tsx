import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { registerAction } from '@/components/auth/RegisterForm'
import LocaleSwitcher from '@/components/layout/LocaleSwitcher'

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
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d0d0d',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(57,230,0,0.08) 0%, transparent 60%)',
      padding: '3.5rem 1.5rem 2.5rem',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
        <LocaleSwitcher />
      </div>
      <div style={{ width: '100%', maxWidth: '320px' }}>

        {/* Лого */}
        <div style={{ textAlign: 'center', marginBottom: '1.1rem' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '24px',
            background: '#39e600',
            color: '#000',
            margin: '0 auto 0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
          }}>
            HS
          </div>
          <div style={{ color: '#aaa', fontSize: '0.85rem', fontWeight: 600 }}>
            Handbalancer&apos;s Studio
          </div>
        </div>


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

        <form action={registerAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            type="text"
            name="name"
            placeholder={t('name')}
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
            minLength={6}
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

          <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', color: '#777', fontSize: '0.78rem', lineHeight: 1.45 }}>
            <input
              type="checkbox"
              name="legalConsent"
              required
              style={{ marginTop: '0.15rem', accentColor: '#39e600' }}
            />
            <span>
              {t('legalConsentPrefix')}{' '}
              <Link href="/terms" style={{ color: '#aaa', textDecoration: 'none' }}>
                {t('termsLink')}
              </Link>{' '}
              {t('legalConsentAnd')}{' '}
              <Link href="/privacy" style={{ color: '#aaa', textDecoration: 'none' }}>
                {t('privacyLink')}
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#39e600',
              color: '#000',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              marginTop: '0.5rem',
            }}
          >
            {t('submit')}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#444', fontSize: '0.75rem', marginTop: '1.75rem', letterSpacing: '0.05em' }}>
          {t('hasAccount')}{' '}
          <Link href="/login" style={{ color: '#39e600', fontWeight: 500, textDecoration: 'none' }}>
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}
