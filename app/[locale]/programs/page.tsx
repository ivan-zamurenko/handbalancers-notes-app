import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/db/auth'
import { getCategories } from '@/lib/db/categories'
import { getAllPrograms, getAllEnrollments } from '@/lib/db/programs'
import { getNextDay } from '@/lib/db/dayProgress'
import ProgramCard from '@/components/programs/ProgramCard'

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('programs')
  const [categories, programs, enrollments] = await Promise.all([
    getCategories(),
    getAllPrograms(),
    getAllEnrollments(user.id),
  ])

  // Визначаємо які програми завершені (enrolled + немає наступного дня)
  const completedIds = new Set(
    (await Promise.all(
      enrollments.map(async ({ program }) => {
        const next = await getNextDay(user.id, program.id)
        return next === null ? program.id : null
      })
    )).filter(Boolean) as string[]
  )

  return (
    <main style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>{t('title')}</h1>
      {categories.map(category => {
        const categoryPrograms = programs.filter(p => p.category_id === category.id)
        if (!categoryPrograms.length) return null
        const title = locale === 'en' ? category.title_en : category.title_ua
        return (
          <section key={category.id} style={{ marginBottom: '2rem' }}>
            <h2>{title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categoryPrograms.map(program => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  locale={locale}
                  isCompleted={completedIds.has(program.id)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
