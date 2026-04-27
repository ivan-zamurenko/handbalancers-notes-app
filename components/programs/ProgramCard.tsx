'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Program } from '@/types'

export default function ProgramCard({ program }: { program: Program }) {
  const t = useTranslations('programs')
  return (
    <div>
      <h3>{program.title}</h3>
      <span>{t('level')}: {program.level}</span>
      {/* TODO: thumbnail, к-сть тренувань, статус (куплено/безкоштовне) */}
      <Link href={`/programs/${program.id}`}>{t('view')}</Link>
    </div>
  )
}
