'use client'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { logoutAction } from '@/components/auth/LoginForm'

const NAV_LINKS = [
  { href: '/dashboard', labelKey: 'dashboard' as const, icon: '◈' },
  { href: '/programs', labelKey: 'programs' as const, icon: '▦' },
  { href: '/tracking', labelKey: 'tracking' as const, icon: '◉' },
  { href: '/billing', labelKey: 'billing' as const, icon: '◇' },
]

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
    <>
      {/* Desktop top nav */}
      <nav style={{
        display: 'flex',
        padding: '0 1.5rem',
        height: '52px',
        borderBottom: '1px solid #1a1a1a',
        alignItems: 'center',
        background: 'rgba(13,13,13,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#fff', marginRight: '2.5rem', flexShrink: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '26px', height: '26px', borderRadius: '7px',
            background: '#39e600', color: '#000',
            fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.02em',
          }}>HB</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Handbalancers</span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: '0.25rem' }} className="desktop-nav">
          {NAV_LINKS.map(({ href, labelKey }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                style={{
                  color: isActive ? '#fff' : '#666',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  letterSpacing: '0.02em',
                  fontWeight: isActive ? 600 : 400,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  background: isActive ? '#1a1a1a' : 'transparent',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                {t(labelKey)}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '2px',
                    borderRadius: '99px',
                    background: '#39e600',
                  }} />
                )}
              </Link>
            )
          })}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => switchLocale(locale === 'ua' ? 'en' : 'ua')}
            style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '0.2rem 0.5rem', cursor: 'pointer', color: '#888', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', transition: 'border-color 0.15s' }}
          >
            {locale === 'ua' ? 'EN' : 'UA'}
          </button>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.8rem', letterSpacing: '0.03em', transition: 'color 0.15s' }}
          >
            {t('logout')}
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'rgba(13,13,13,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {NAV_LINKS.map(({ href, labelKey, icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                textDecoration: 'none',
                color: isActive ? '#39e600' : '#555',
                fontSize: '1.1rem',
                transition: 'color 0.15s',
              }}
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{icon}</span>
              <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {t(labelKey)}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
