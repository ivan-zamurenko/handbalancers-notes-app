import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import type { Program } from '@/types'

type Props = {
  program: Program
  locale: string
}

export default function ProgramCard({ program, locale }: Props) {
  const t = useTranslations('programs')
  const title = locale === 'en' ? program.title_en : program.title_ua
  const description = locale === 'en' ? program.description_en : program.description_ua
  const levelLabel = t(program.level as 'beginner' | 'intermediate' | 'advanced')

  return (
    <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: program.is_free ? '#dcfce7' : '#fef9c3' }}>
          {program.is_free ? t('free') : t('paid')}
        </span>
      </div>
      {description && <p style={{ color: '#666', margin: '0.5rem 0' }}>{description}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#888' }}>{levelLabel}</span>
        <Link href={`/programs/${program.id}`}>{t('view')} →</Link>
      </div>
    </div>
  )
}
