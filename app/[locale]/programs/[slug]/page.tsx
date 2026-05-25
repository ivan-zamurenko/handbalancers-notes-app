import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getUser } from '@/lib/db/auth'
import { getProgramBySlug, getWeeksByProgram, getDaysByWeek, isEnrolled } from '@/lib/db/programs'
import { getNextDay, getCompletedDayIds } from '@/lib/db/dayProgress'
import { hasActiveAccess } from '@/lib/db/subscriptions'
import StartProgramButton from '@/components/programs/StartProgramButton'
import WeekAccordion from '@/components/programs/WeekAccordion'

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const user = await getUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('programs')
  const program = await getProgramBySlug(slug)
  if (!program) notFound()

  const weeks = await getWeeksByProgram(program.id)
  const weeksWithDays = await Promise.all(
    weeks.map(async week => ({
      week,
      days: await getDaysByWeek(week.id),
    }))
  )

  const [completedIds, nextDay, enrolled, canAccess] = await Promise.all([
    getCompletedDayIds(user.id, program.id),
    getNextDay(user.id, program.id),
    isEnrolled(user.id, program.id),
    program.is_free ? Promise.resolve(true) : hasActiveAccess(user.id),
  ])

  const title = locale === 'en' ? program.title_en : program.title_ua
  const description = locale === 'en' ? program.description_en : program.description_ua

  const levelColor = program.level === 'beginner' ? '#39e600' : program.level === 'intermediate' ? '#f5a623' : '#f87171'

  return (
    <main style={{ padding: '2.5rem 1.25rem 3rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ color: '#fff', fontWeight: 800, margin: '0 0 0.625rem' }}>{title}</h1>
      {description && (
        <p style={{ color: '#666', margin: '0 0 1.125rem', fontSize: '0.85rem', lineHeight: 1.5 }}>{description}</p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.25rem' }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: levelColor,
          border: `1px solid ${levelColor}`,
          borderRadius: '999px',
          padding: '2px 9px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {t(program.level as 'beginner' | 'intermediate' | 'advanced')}
        </span>
        <span style={{ color: '#444', fontSize: '0.75rem' }}>
          {program.is_free ? t('free') : t('paid')}
        </span>
      </div>

      {!enrolled && canAccess && (
        <StartProgramButton programId={program.id} isFree={program.is_free} slug={slug} />
      )}
      {!enrolled && !canAccess && (
        <Link
          href="/billing"
          style={{
            display: 'inline-block',
            marginBottom: '1.5rem',
            padding: '0.75rem 2rem',
            background: '#39e600',
            color: '#000',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
        >
          {t('upgrade')}
        </Link>
      )}

      <WeekAccordion
        weeksWithDays={weeksWithDays}
        completedIds={Array.from(completedIds)}
        nextDayId={nextDay?.id ?? null}
        canAccess={canAccess}
        locale={locale}
        labels={{
          completed: t('completed'),
          nextDay: t('nextDay'),
          paid: t('paid'),
        }}
      />
    </main>
  )
}

