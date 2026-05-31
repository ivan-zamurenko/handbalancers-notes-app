import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function TrialBanner({ daysLeft, locale }: { daysLeft: number; locale: string }) {
  const t = await getTranslations('trial')

  return (
    <div style={{
      background: 'rgba(255, 150, 0, 0.08)',
      borderBottom: '1px solid rgba(255, 150, 0, 0.2)',
      padding: '0.6rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      fontSize: '0.85rem',
      color: '#ff9600',
    }}>
      <span>⚠️ {t('warning', { days: daysLeft })}</span>
      <Link
        href={`/${locale}/billing`}
        style={{ color: '#2979FF', fontWeight: 600, textDecoration: 'none' }}
      >
        {t('subscribeCta')} →
      </Link>
    </div>
  )
}
