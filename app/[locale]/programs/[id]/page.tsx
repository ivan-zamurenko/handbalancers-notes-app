import { getTranslations } from 'next-intl/server'

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id } = await params
  const t = await getTranslations('programs')

  return (
    <main>
      <h1>{t('detail')} #{id}</h1>
      {/* TODO: опис програми, список сесій, кнопка "Почати тренування" */}
    </main>
  )
}
