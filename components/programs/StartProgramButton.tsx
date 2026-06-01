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
        marginBottom: '1.5rem',
        padding: '0.875rem 2rem',
        background: '#39e600',
        color: '#000',
        border: 'none',
        borderRadius: '14px',
        fontSize: '0.9rem',
        fontWeight: 700,
        cursor: isPending ? 'wait' : 'pointer',
        opacity: isPending ? 0.6 : 1,
        width: '100%',
      }}
    >
      {isPending ? t('loading') : t('startProgram')}
    </button>
  )
}
