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
      padding: '0 1.5rem',
      height: '52px',
      borderBottom: '1px solid #1a1a1a',
      alignItems: 'center',
      background: '#0d0d0d',
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#fff', marginRight: '2.5rem', flexShrink: 0 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '26px', height: '26px', borderRadius: '7px',
          background: '#39e600', color: '#000',
          fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.02em',
        }}>HB</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Handbalancers</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link href="/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.03em' }}>{t('dashboard')}</Link>
        <Link href="/programs" style={{ color: '#888', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.03em' }}>{t('programs')}</Link>
        <Link href="/tracking" style={{ color: '#888', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.03em' }}>{t('tracking')}</Link>
        <Link href="/billing" style={{ color: '#888', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.03em' }}>{t('billing')}</Link>
      </div>

      {/* Right controls */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={() => switchLocale(locale === 'ua' ? 'en' : 'ua')}
          style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '0.2rem 0.5rem', cursor: 'pointer', color: '#888', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em' }}
        >
          {locale === 'ua' ? 'EN' : 'UA'}
        </button>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.8rem', letterSpacing: '0.03em' }}
        >
          {t('logout')}
        </button>
      </div>
    </nav>
  )
}
