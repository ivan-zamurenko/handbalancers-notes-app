'use client'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import LocaleSwitcher from './LocaleSwitcher'

const NAV_LINKS = [
  { href: '/dashboard', labelKey: 'dashboard' as const, icon: '◈' },
  { href: '/programs', labelKey: 'programs' as const, icon: '▦' },
  { href: '/tracking', labelKey: 'tracking' as const, icon: '◉' },
]

export default function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()

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
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: '#fff', marginRight: '2.5rem', flexShrink: 0 }}>
          {/* Іконка HS — зелений квадрат */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '28px', height: '28px', borderRadius: '7px',
            background: '#39e600', color: '#000',
            fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.04em',
          }}>
            HS
          </span>
          {/* Повна назва одним рядком — читається миттєво */}
          <span style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Handbalancer&apos;s Studio
          </span>
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
                  // Без pill — один індикатор: тільки підкреслення + білий текст
                  background: 'transparent',
                  transition: 'color 0.15s ease',
                  position: 'relative',
                }}
              >
                {t(labelKey)}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: '0.75rem',
                    right: '0.75rem',
                    height: '2px',
                    borderRadius: '99px',
                    background: '#39e600',
                    transformOrigin: 'left center',
                    animation: 'navUnderline 0.3s ease',
                  }} />
                )}
              </Link>
            )
          })}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Plain text кнопки — Apple-стандарт для утиліт в navbar */}
          <LocaleSwitcher />
          <Link
            href="/billing"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '30px', height: '30px', borderRadius: '50%',
              border: '1.5px solid #2a2a2a',
              color: '#666', textDecoration: 'none',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#444'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLAnchorElement).style.color = '#666' }}
            title={t('account')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="7" cy="4.5" r="2.5"/>
              <path d="M1.5 12.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>
            </svg>
          </Link>
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
              <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>
                {t(labelKey)}
              </span>
            </Link>
          )
        })}
        {/* Profile у mobile */}
        <Link
          href="/billing"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            color: pathname === '/billing' ? '#39e600' : '#555',
            transition: 'color 0.15s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="9" cy="5.5" r="3"/>
            <path d="M2 16c0-3.5 3-6 7-6s7 2.5 7 6"/>
          </svg>
          <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>
            {t('account')}
          </span>
        </Link>
      </nav>
    </>
  )
}
