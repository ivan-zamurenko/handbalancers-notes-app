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
  const isAllDone = enrolled && !nextDay && weeksWithDays.flatMap(w => w.days).length > 0

  return (
    <main style={{ maxWidth: '480px', margin: '0 auto', paddingBottom: enrolled && nextDay ? '6rem' : '3rem' }}>

      {/* Назад */}
      <div style={{ padding: '1.25rem 1.25rem 0' }}>
        <Link href="/programs" style={{ fontSize: '0.875rem', color: '#555', textDecoration: 'none' }}>
          {t('back')}
        </Link>
      </div>

      <div style={{ padding: '1.25rem 1.25rem 0' }}>
        <h1 style={{ color: '#fff', fontWeight: 800, margin: '0 0 0.625rem' }}>{title}</h1>
        {description && (
          <p style={{ color: '#666', margin: '0 0 1.125rem', fontSize: '0.85rem', lineHeight: 1.5 }}>{description}</p>
        )}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#555' }}>
            {t(program.level as 'beginner' | 'intermediate' | 'advanced')} · {program.is_free ? t('free') : t('paid')}
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
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            {t('upgrade')}
          </Link>
        )}
      </div>

      <div style={{ padding: '0 1.25rem' }}>
        <WeekAccordion
          weeksWithDays={weeksWithDays}
          completedIds={Array.from(completedIds)}
          nextDayId={nextDay?.id ?? null}
          canAccess={canAccess}
          locale={locale}
          programSlug={slug}
          labels={{
            completed: t('completed'),
            paid: t('paid'),
          }}
        />
      </div>

      {/* Completion state */}
      {isAllDone && (
        <p style={{ textAlign: 'center', color: '#39e600', fontSize: '0.875rem', marginTop: '2rem', padding: '0 1.25rem' }}>
          ✓ {t('completed')}
        </p>
      )}

      {/* Sticky CTA — тільки якщо записаний і є наступний день */}
      {enrolled && nextDay && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem 1.25rem calc(1rem + env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, #0d0d0d 60%, transparent)',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Link
            href={`/programs/${slug}/w${nextDay.weeks.order}/d${nextDay.order}`}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '440px',
              padding: '0.875rem',
              background: '#39e600',
              color: '#000',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            {t('continueProgram')}
          </Link>
        </div>
      )}
    </main>
  )
}
