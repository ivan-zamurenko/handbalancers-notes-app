'use client'
import { useTranslations } from 'next-intl'

export default function LogForm({ exerciseId }: { exerciseId?: string }) {
  const t = useTranslations('workout')
  // TODO: стан (hold, reps, note)
  // TODO: handleSubmit → supabase.from('workout_logs').insert(...)
  return (
    <form>
      <input type="number" placeholder={t('holdPlaceholder')} />
      <input type="number" placeholder={t('repsPlaceholder')} />
      <textarea placeholder={t('notePlaceholder')} />
      <button type="submit">{t('save')}</button>
    </form>
  )
}
