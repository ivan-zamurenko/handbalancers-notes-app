import { getTranslations } from 'next-intl/server'

export default async function TermsPage() {
  const t = await getTranslations('legal')

  return (
    <main style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem' }}>{t('termsTitle')}</h1>
      <p style={{ color: '#888', lineHeight: 1.7, margin: '0 0 0.75rem' }}>{t('termsIntro')}</p>
      <p style={{ color: '#666', lineHeight: 1.7, margin: 0 }}>{t('termsContact')}</p>
    </main>
  )
}
