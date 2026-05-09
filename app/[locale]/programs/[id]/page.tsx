import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase-server'
import { getProgramById, getWeeksByProgram, getDaysByWeek } from '@/lib/db/programs'
import { getNextDay, getCompletedDayIds } from '@/lib/db/dayProgress'

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('programs')
  const program = await getProgramById(id)
  if (!program) notFound()

  const weeks = await getWeeksByProgram(id)
  const weeksWithDays = await Promise.all(
    weeks.map(async week => ({
      week,
      days: await getDaysByWeek(week.id),
    }))
  )

  const [completedIds, nextDay] = await Promise.all([
    getCompletedDayIds(user.id, id),
    getNextDay(user.id, id),
  ])

  const title = locale === 'en' ? program.title_en : program.title_ua
  const description = locale === 'en' ? program.description_en : program.description_ua

  return (
    <main style={{ padding: '1rem' }}>
      <h1>{title}</h1>
      {description && <p style={{ color: '#666' }}>{description}</p>}
      <p style={{ fontSize: '0.875rem' }}>
        {t(program.level as 'beginner' | 'intermediate' | 'advanced')} · {program.is_free ? t('free') : t('paid')}
      </p>

      {weeksWithDays.map(({ week, days }) => {
        const weekTitle = locale === 'en' ? week.title_en : week.title_ua
        return (
          <section key={week.id} style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', color: '#555' }}>{weekTitle}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {days.map(day => {
                const dayTitle = locale === 'en' ? day.title_en : day.title_ua
                const isCompleted = completedIds.has(day.id)
                const isNext = nextDay?.id === day.id

                return (
                  <Link
                    key={day.id}
                    href={`/workout/${day.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: isNext ? '2px solid #3b82f6' : '1px solid #eee',
                      background: isCompleted ? '#f0fdf4' : isNext ? '#eff6ff' : '#fff',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <span>{dayTitle}</span>
                    <span style={{ fontSize: '0.875rem', color: isCompleted ? '#16a34a' : isNext ? '#3b82f6' : '#999' }}>
                      {isCompleted ? `✓ ${t('completed')}` : isNext ? `→ ${t('nextDay')}` : ''}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </main>
  )
}

