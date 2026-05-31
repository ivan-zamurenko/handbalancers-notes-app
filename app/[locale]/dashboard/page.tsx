import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/db/auth'
import { getStreak } from '@/lib/services/training'
import { getAllEnrollments } from '@/lib/db/programs'
import { getNextDay, getTotalDaysInProgram, getCompletedDayIds, getCompletedDates } from '@/lib/db/dayProgress'
import { getExerciseCount } from '@/lib/db/exercises'
import StreakBadge from '@/components/dashboard/StreakBadge'
import TodayCard from '@/components/dashboard/TodayCard'
import WeekCalendar from '@/components/dashboard/WeekCalendar'
import { Link } from '@/i18n/navigation'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('dashboard')

  const [streak, enrollments, completedDates] = await Promise.all([
    getStreak(user.id),
    getAllEnrollments(user.id),
    getCompletedDates(user.id),
  ])

  // Завантажуємо дані лише активних (незавершених) програм
  const allProgramsData = await Promise.all(
    enrollments.map(async (enrollment) => {
      const [todayDay, completedIds, totalDays] = await Promise.all([
        getNextDay(user.id, enrollment.program.id),
        getCompletedDayIds(user.id, enrollment.program.id),
        getTotalDaysInProgram(enrollment.program.id),
      ])
      const exerciseCount = todayDay ? await getExerciseCount(todayDay.id) : 0
      return { enrollment, todayDay, dayNumber: completedIds.size + 1, totalDays, exerciseCount }
    })
  )

  // На Home показуємо тільки програми з активним наступним днем
  const activePrograms = allProgramsData.filter(
    (d): d is typeof d & { todayDay: NonNullable<typeof d.todayDay> } => d.todayDay !== null
  )
  const hasEnrollments = enrollments.length > 0

  return (
    <main style={{ padding: '1.5rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{t('title')}</h1>
        <StreakBadge streak={streak} />
      </div>

      <WeekCalendar completedDates={completedDates} />

      {activePrograms.length > 0 ? (
        activePrograms.map(({ enrollment, todayDay, dayNumber, totalDays, exerciseCount }) => (
          <TodayCard
            key={enrollment.program.id}
            program={enrollment.program}
            todayDay={todayDay}
            dayNumber={dayNumber}
            totalDays={totalDays}
            exerciseCount={exerciseCount}
            locale={locale}
          />
        ))
      ) : hasEnrollments ? (
        // Є enrollment-и, але всі програми завершено
        <div style={{ padding: '2rem 1.5rem', borderRadius: '16px', background: '#141414', border: '1px solid #1e1e1e', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎉</p>
          <p style={{ color: '#fff', fontWeight: 600, marginBottom: '0.4rem' }}>{t('allProgramsDone')}</p>
          <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{t('allProgramsDoneSub')}</p>
          <Link
            href="/programs"
            style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#39e600', color: '#000', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}
          >
            {t('browsePrograms')} →
          </Link>
        </div>
      ) : (
        // Новий юзер — ще не обирав програму
        <div style={{ padding: '2rem 1.5rem', borderRadius: '16px', background: '#141414', border: '1px solid #1e1e1e', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👋</p>
          <p style={{ color: '#fff', fontWeight: 600, marginBottom: '0.4rem' }}>{t('welcomeNew')}</p>
          <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{t('welcomeNewSub')}</p>
          <Link
            href="/programs"
            style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#39e600', color: '#000', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}
          >
            {t('browsePrograms')} →
          </Link>
        </div>
      )}
    </main>
  )
}
