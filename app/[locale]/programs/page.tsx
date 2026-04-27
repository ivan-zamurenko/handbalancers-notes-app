import { getTranslations } from 'next-intl/server'
import ProgramList from '@/components/programs/ProgramList'

export default async function ProgramsPage() {
  const t = await getTranslations('programs')

  return (
    <main>
      <h1>{t('title')}</h1>
      <ProgramList />
    </main>
  )
}
