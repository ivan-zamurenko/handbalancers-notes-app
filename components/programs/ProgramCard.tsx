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

  const levelColor = program.level === 'beginner' ? '#39e600' : program.level === 'intermediate' ? '#f5a623' : '#f87171'
  const levelBg = program.level === 'beginner' ? 'rgba(57,230,0,0.08)' : program.level === 'intermediate' ? 'rgba(245,166,35,0.1)' : 'rgba(248,113,113,0.1)'

  return (
    <div style={{ border: '1px solid #1e1e1e', borderLeft: `3px solid ${levelColor}`, borderRadius: '10px', padding: '1.25rem', background: '#141414' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0, marginLeft: '0.75rem' }}>
          {isCompleted && (
            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: 'rgba(57,230,0,0.1)', color: '#39e600' }}>
              ✓ {t('completed')}
            </span>
          )}
          <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: program.is_free ? 'rgba(57, 230, 0, 0.1)' : 'rgba(255, 200, 0, 0.1)', color: program.is_free ? '#39e600' : '#f5a623' }}>
            {program.is_free ? t('free') : t('paid')}
          </span>
        </div>
      </div>
      {description && <p style={{ color: '#666', margin: '0 0 0.875rem', fontSize: '0.875rem', lineHeight: 1.5 }}>{description}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: levelBg, color: levelColor }}>{levelLabel}</span>
        <Link href={`/programs/${program.slug}`} style={{ color: '#2979ff', fontSize: '0.875rem', fontWeight: 500 }}>{t('view')} →</Link>
      </div>
    </div>
  )
}
