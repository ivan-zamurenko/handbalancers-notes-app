import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getProgramBySlug, getWeeksByProgram, getDaysByWeek, getNextDay, getCompletedDayIds, isEnrolled } from '@/lib/services/data'
import { userHasActiveAccess } from '@/lib/services/subscriptions'
import StartProgramButton from '@/components/programs/StartProgramButton'
import WeekAccordion from '@/components/programs/WeekAccordion'

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const user = await getCurrentUser()
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
    program.is_free ? Promise.resolve(true) : userHasActiveAccess(user.id),
  ])

  const title = locale === 'en' ? program.title_en : program.title_ua
  const description = locale === 'en' ? program.description_en : program.description_ua

  const levelColor = program.level === 'beginner' ? '#39e600' : program.level === 'intermediate' ? '#f5a623' : '#f87171'

  return (
    <main style={{ padding: '2.5rem 1.25rem 3rem', maxWidth: '480px', margin: '0 auto' }}>
      <Link
        href="/programs"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#555', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1.25rem', transition: 'color 0.15s' }}
      >
        <svg width="6" height="11" viewBox="0 0 6 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 1L1 5.5L5 10"/></svg>
        {t('back')}
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: levelColor,
          border: `1px solid ${levelColor}33`,
          background: `${levelColor}12`,
          borderRadius: '999px',
          padding: '2px 8px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {t(program.level as 'beginner' | 'intermediate' | 'advanced')}
        </span>
        <span style={{ color: '#555', fontSize: '0.72rem' }}>
          {program.is_free ? t('free') : t('paid')}
        </span>
      </div>
      <h1 style={{ color: '#fff', fontWeight: 800, margin: '0 0 0.625rem' }}>{title}</h1>
      {description && (
        <p style={{ color: '#666', margin: '0 0 2rem', fontSize: '0.85rem', lineHeight: 1.5 }}>{description}</p>
      )}

      {enrolled && nextDay && (
        <Link
          href={`/programs/${slug}/w${nextDay.weeks.order}/d${nextDay.order}`}
          style={{
            display: 'inline-block',
            marginBottom: '2rem',
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
          {t('continueProgram')}
        </Link>
      )}
      {enrolled && !nextDay && (
        <p style={{ color: '#39e600', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
          ✓ {t('completed')}
        </p>
      )}
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
        programSlug={slug}
        labels={{
          paid: t('paid'),
        }}
      />
    </main>
  )
}

