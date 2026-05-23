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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#fff',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤸</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{t('title')}</h1>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: '#dc2626',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
          }}>
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={registerAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            name="name"
            placeholder={t('name')}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1.5px solid #e5e7eb',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1.5px solid #e5e7eb',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="password"
            name="password"
            placeholder={t('password')}
            minLength={6}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1.5px solid #e5e7eb',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '10px',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              marginTop: '0.25rem',
            }}
          >
            {t('submit')}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginTop: '1.5rem' }}>
          {t('hasAccount')}{' '}
          <Link href="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}
