import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getCategories, getAllPrograms, getAllEnrollments, getCompletedProgramIds } from '@/lib/services/data'
import ProgramCard from '@/components/programs/ProgramCard'
import ProgramShelf from '@/components/programs/ProgramShelf'

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('programs')
  const [categories, programs, enrollments] = await Promise.all([
    getCategories(),
    getAllPrograms(),
    getAllEnrollments(user.id),
  ])

  const enrolledProgramIds = enrollments.map(e => e.program.id)
  const completedIds = await getCompletedProgramIds(user.id, enrolledProgramIds)

  return (
    <main style={{ maxWidth: '480px', margin: '0 auto', paddingBottom: '2rem' }}>
      <h1 style={{ padding: '1.25rem 1rem 0', margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
        {t('title')}
      </h1>

      {/* "Для тебе" — активні програми користувача */}
      {enrollments.length > 0 && (
        <section style={{ marginTop: '1.75rem' }}>
          <p style={{ margin: '0 0 0.75rem', padding: '0 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t('forYou')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 1rem' }}>
            {enrollments.map(({ program }) => (
              <ProgramCard
                key={program.id}
                program={program}
                locale={locale}
                isCompleted={completedIds.has(program.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Категорії — горизонтальний скрол (Apple shelf) */}
      {categories.map(category => {
        const categoryPrograms = programs.filter(p => p.category_id === category.id)
        if (!categoryPrograms.length) return null
        const categoryTitle = locale === 'en' ? category.title_en : category.title_ua
        return (
          <section key={category.id} style={{ marginTop: '2rem' }}>
            <h2 style={{ margin: '0 0 0.75rem', padding: '0 1rem', fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              {categoryTitle}
            </h2>
            <div style={{ paddingLeft: '1rem' }}>
              <ProgramShelf
                programs={categoryPrograms}
                locale={locale}
                completedIds={completedIds}
              />
            </div>
          </section>
        )
      })}
    </main>
  )
}
