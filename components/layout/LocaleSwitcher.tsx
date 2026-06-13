'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState(locale)

  function switchLocale(next: string) {
    if (next === locale) return
    setActive(next)
    setTimeout(() => {
      router.replace(pathname, { locale: next })
    }, 250)
  }

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      gap: '0.25rem',
      alignItems: 'center',
    }}>
      {(['ua', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.2rem 0',
            width: '2rem',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textAlign: 'center',
            color: active === l ? '#39e600' : '#444',
            transition: 'color 0.25s ease',
          }}
        >
          {l === 'ua' ? 'UA' : 'EN'}
        </button>
      ))}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '2rem',
        height: '1px',
        background: '#39e600',
        transform: active === 'en' ? 'translateX(calc(2rem + 0.25rem))' : 'translateX(0)',
        transition: 'transform 0.25s ease',
      }} />
    </div>
  )
}
