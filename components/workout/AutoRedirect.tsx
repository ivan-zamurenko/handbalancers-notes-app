'use client'
import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

/** Автоматично перенаправляє на /dashboard через TOTAL_SEC секунд. Показує countdown юзеру. */
const TOTAL_SEC = 4

export default function AutoRedirect() {
  const router = useRouter()
  const t = useTranslations('workout')
  const [sec, setSec] = useState(TOTAL_SEC)

  useEffect(() => {
    const interval = setInterval(() => setSec(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (sec <= 0) router.replace('/dashboard')
  }, [sec, router])

  return (
    <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '1.25rem' }}>
      {t('redirectingIn', { sec: Math.max(sec, 0) })}
    </p>
  )
}
