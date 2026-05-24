'use client'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { logoutAction } from '@/components/auth/LoginForm'

export default function Navbar() {
  const t = useTranslations('nav')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  async function handleLogout() {
    await logoutAction()
  }

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
  }

  return (
    <nav style={{
      display: 'flex',
      gap: '1.5rem',
      padding: '0.875rem 1.5rem',
      borderBottom: '1px solid #1a1a1a',
      alignItems: 'center',
      background: '#0d0d0d',
    }}>
      <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{t('dashboard')}</Link>
      <Link href="/programs" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{t('programs')}</Link>
      <Link href="/tracking" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{t('tracking')}</Link>
      <Link href="/billing" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{t('billing')}</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={() => switchLocale(locale === 'ua' ? 'en' : 'ua')}
          style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '0.2rem 0.5rem', cursor: 'pointer', color: '#888', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em' }}
        >
          {locale === 'ua' ? 'EN' : 'UA'}
        </button>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.8rem', letterSpacing: '0.05em' }}
        >
          {t('logout')}
        </button>
      </div>
    </nav>
  )
}
