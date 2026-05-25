import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/db/auth'
import { getStreak } from '@/lib/services/training'
import { getChartData } from '@/lib/db/workoutLogs'
import { getFavoriteExercises } from '@/lib/db/favorites'
import { getAllEnrollments } from '@/lib/db/programs'
import { getNextDay, getTotalDaysInProgram, getCompletedDayIds, getCompletedDates } from '@/lib/db/dayProgress'
import StreakBadge from '@/components/dashboard/StreakBadge'
import ProgressChart from '@/components/dashboard/ProgressChart'
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

  const [streak, favorites, enrollments, completedDates] = await Promise.all([
    getStreak(user.id),
    getFavoriteExercises(user.id),
    getAllEnrollments(user.id),
    getCompletedDates(user.id),
  ])

  // Дані всіх активних програм — завантажуємо паралельно
  const programsData = await Promise.all(
    enrollments.map(async (enrollment) => {
      const [todayDay, completedIds, totalDays] = await Promise.all([
        getNextDay(user.id, enrollment.program.id),
        getCompletedDayIds(user.id, enrollment.program.id),
        getTotalDaysInProgram(enrollment.program.id),
      ])
      return { enrollment, todayDay, dayNumber: completedIds.size + 1, totalDays }
    })
  )

  const chartDataPerExercise = await Promise.all(
    favorites.map(ex => getChartData(user.id, ex.id).then(data => ({ exercise: ex, data })))
  )

  return (
    <main style={{ padding: '1.5rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{t('title')}</h1>
        <StreakBadge streak={streak} />
      </div>

      <WeekCalendar completedDates={completedDates} />

      {programsData.length > 0 ? (
        programsData.map(({ enrollment, todayDay, dayNumber, totalDays }) => (
          <TodayCard
            key={enrollment.program.id}
            program={enrollment.program}
            todayDay={todayDay}
            dayNumber={dayNumber}
            totalDays={totalDays}
            locale={locale}
          />
        ))
      ) : (
        <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#141414', border: '1px solid #1e1e1e', marginBottom: '1.5rem' }}>
          <p style={{ color: '#888', marginBottom: '0.75rem' }}>{t('noProgram')}</p>
          <Link href="/programs" style={{ color: '#2979ff', fontWeight: 500 }}>
            {t('browsePrograms')} →
          </Link>
        </div>
      )}

      {favorites.length > 0 && (
        <section>
          {chartDataPerExercise.map(({ exercise, data }) => (
            <div key={exercise.id} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                ⭐ {locale === 'en' ? exercise.name_en : exercise.name_ua}
              </h3>
              <ProgressChart data={data} />
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
