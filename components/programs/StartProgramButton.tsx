'use client'
import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { enrollAction } from '@/components/programs/actions'

type Props = {
  programId: string
  isFree: boolean
  slug: string
}

/** Кнопка "Почати програму" — записує юзера і перезавантажує сторінку. */
export default function StartProgramButton({ programId, isFree, slug }: Props) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('programs')
  const router = useRouter()

  function handleStart() {
    startTransition(async () => {
      await enrollAction(programId, isFree)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleStart}
      disabled={isPending}
      style={{
        marginTop: '1rem',
        padding: '0.75rem 2rem',
        background: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: isPending ? 'wait' : 'pointer',
        opacity: isPending ? 0.7 : 1,
      }}
    >
      {isPending ? t('loading') : t('startProgram')}
    </button>
  )
}
