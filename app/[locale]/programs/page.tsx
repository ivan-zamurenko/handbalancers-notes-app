import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'
import { getCategories } from '@/lib/db/categories'
import { getAllPrograms } from '@/lib/db/programs'
import ProgramCard from '@/components/programs/ProgramCard'

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('programs')
  const [categories, programs] = await Promise.all([
    getCategories(),
    getAllPrograms(),
  ])

  return (
    <main style={{ padding: '1rem' }}>
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
                <ProgramCard key={program.id} program={program} locale={locale} />
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
