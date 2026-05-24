'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
  }

  return (
    <div style={{
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
            padding: '0.2rem 0.4rem',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: locale === l ? '#39e600' : '#444',
            borderBottom: locale === l ? '1px solid #39e600' : '1px solid transparent',
            transition: 'color 0.2s',
          }}
        >
          {l === 'ua' ? 'UA' : 'EN'}
        </button>
      ))}
    </div>
  )
}
