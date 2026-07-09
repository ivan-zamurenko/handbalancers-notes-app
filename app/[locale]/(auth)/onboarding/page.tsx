import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getAllEnrollments } from '@/lib/services/data'
import OnboardingClient from './OnboardingClient'

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  // Якщо юзер вже обрав програму — пропускаємо онбординг
  const enrollments = await getAllEnrollments(user.id)
  if (enrollments.length > 0) redirect(`/${locale}/dashboard`)

  return <OnboardingClient />
}
