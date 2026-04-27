'use client'
import { useTranslations } from 'next-intl'

export default function ExerciseStats() {
  const t = useTranslations('tracking')
  return (
    <div>
      <h2>{t('statsTitle')}</h2>
      {/* TODO: dropdown вибір вправи, картки max / avg hold / avg reps */}
    </div>
  )
}
