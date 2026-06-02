import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LEGAL_PROFILE } from '@/lib/legal'

type Props = {
  locale: string
}

export default async function Footer({ locale }: Props) {
  const t = await getTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer style={{
      marginTop: '2rem',
      borderTop: '1px solid #1a1a1a',
      padding: '1.25rem 1rem calc(1.25rem + env(safe-area-inset-bottom))',
      background: '#0d0d0d',
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.78rem', color: '#555' }}>
          Handbalancer&apos;s Studio
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem 1.25rem' }}>
          <a href="https://instagram.com/handbalancersstudio" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none', fontSize: '0.82rem' }}>
            {t('instagram')}
          </a>
          <a href="https://youtube.com/@handbalancersstudio" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none', fontSize: '0.82rem' }}>
            {t('youtube')}
          </a>
          <a href={`mailto:${LEGAL_PROFILE.supportEmail}`} style={{ color: '#888', textDecoration: 'none', fontSize: '0.82rem' }}>
            {t('support')}
          </a>
          <Link href="/privacy" locale={locale} style={{ color: '#888', textDecoration: 'none', fontSize: '0.82rem' }}>
            {t('privacy')}
          </Link>
          <Link href="/terms" locale={locale} style={{ color: '#888', textDecoration: 'none', fontSize: '0.82rem' }}>
            {t('terms')}
          </Link>
        </div>

        <div style={{ fontSize: '0.72rem', color: '#444' }}>
          {t('copyright', { year })}
        </div>
      </div>
    </footer>
  )
}
