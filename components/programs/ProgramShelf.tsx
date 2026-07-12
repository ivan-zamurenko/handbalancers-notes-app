// Pattern: Shelf — горизонтальний скрол ряд програм (Apple Fitness+ style)
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Program } from '@/types'

type Props = {
  programs: Program[]
  locale: string
  completedIds: Set<string>
  categoryColor?: string
}

export default async function ProgramShelf({ programs, locale, completedIds, categoryColor }: Props) {
  const t = await getTranslations('programs')

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        overflowX: 'auto',
        paddingRight: '1rem',
        paddingBottom: '0.25rem',
        scrollSnapType: 'x mandatory',
      }}
    >
      {programs.map(program => {
        const title = locale === 'en' ? program.title_en : program.title_ua
        const levelLabel = t(program.level as 'beginner' | 'intermediate' | 'advanced')
        const isCompleted = completedIds.has(program.id)

        return (
          <Link
            key={program.id}
            href={`/programs/${program.slug}`}
            style={{
              flexShrink: 0,
              width: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '110px',
              background: '#141414',
              border: '1px solid #1e1e1e',
              borderTop: `2px solid ${categoryColor ?? '#2a2a2a'}`,
              borderRadius: '12px',
              padding: '1rem',
              scrollSnapAlign: 'start',
              textDecoration: 'none',
            }}
          >
            <p style={{ margin: 0, color: '#fff', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.35 }}>
              {title}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#555' }}>
                {levelLabel} · {program.is_free ? t('free') : t('paid')}
              </span>
              {isCompleted && <span style={{ fontSize: '0.75rem', color: '#39e600' }}>✓</span>}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
