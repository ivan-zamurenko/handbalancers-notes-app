import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import type { Program } from '@/types'

type Props = {
  program: Program
  locale: string
  isCompleted?: boolean
}

export default function ProgramCard({ program, locale, isCompleted = false }: Props) {
  const t = useTranslations('programs')
  const title = locale === 'en' ? program.title_en : program.title_ua
  const description = locale === 'en' ? program.description_en : program.description_ua
  const levelLabel = t(program.level as 'beginner' | 'intermediate' | 'advanced')

  return (
    <div style={{ border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1.25rem', background: '#141414' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
        {isCompleted && (
          <span style={{ fontSize: '0.75rem', color: '#39e600', flexShrink: 0, marginLeft: '0.75rem' }}>
            ✓ {t('completed')}
          </span>
        )}
      </div>
      {description && <p style={{ color: '#666', margin: '0 0 0.875rem', fontSize: '0.875rem', lineHeight: 1.5 }}>{description}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#555' }}>
          {levelLabel} · {program.is_free ? t('free') : t('paid')}
        </span>
        <Link href={`/programs/${program.slug}`} style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>{t('view')} →</Link>
      </div>
    </div>
  )
}
