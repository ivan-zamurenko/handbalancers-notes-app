'use server'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getProgramBySlug, enrollProgram } from '@/lib/services/data'
import { sendWelcomeEmail } from '@/lib/email'

const GOAL_TO_SLUG: Record<string, string> = {
  handstand:   'handstand-beginners',
  flexibility: 'basic-flexibility',
  strength:    'strength-foundations',
  health:      'daily-prehab',
}

/** Записує юзера на програму, що відповідає обраній цілі, і редіректить на День 1. */
export async function onboardingAction(formData: FormData): Promise<void> {
  const locale = await getLocale()
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const goal = formData.get('goal') as string
  const slug = GOAL_TO_SLUG[goal]
  if (!slug) redirect(`/${locale}/dashboard`)

  const program = await getProgramBySlug(slug)
  if (!program) redirect(`/${locale}/dashboard`)

  await enrollProgram(user.id, program.id)

  // fire-and-forget: email не блокує перехід на день 1
  const day1Url = `/${locale}/programs/${slug}/w1/d1`
  const programTitle = locale === 'en' ? (program.title_en ?? program.title_ua) : program.title_ua
  void sendWelcomeEmail({
    email: user.email!,
    name: (user.user_metadata?.full_name as string | undefined) ?? user.email!,
    locale,
    programTitle,
    day1Url,
  })

  redirect(day1Url)
}
