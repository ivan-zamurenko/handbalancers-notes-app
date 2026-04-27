'use client'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'

export default function Navbar() {
  const t = useTranslations('nav')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
  }

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Link href="/dashboard">{t('dashboard')}</Link>
      <Link href="/programs">{t('programs')}</Link>
      <Link href="/tracking">{t('tracking')}</Link>
      <Link href="/billing">{t('billing')}</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={() => switchLocale(locale === 'ua' ? 'en' : 'ua')}
          style={{ fontWeight: 'bold' }}
        >
          {locale === 'ua' ? 'EN' : 'UA'}
        </button>
        <button onClick={handleLogout}>{t('logout')}</button>
      </div>
    </nav>
  )
}
