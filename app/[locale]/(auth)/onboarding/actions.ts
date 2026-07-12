'use server'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getProgramBySlug, enrollProgram } from '@/lib/services/data'
import { sendWelcomeEmail } from '@/lib/email'

// Pattern: Strategy — маппінг (ціль × рівень) → slug програми
const GOAL_LEVEL_TO_SLUG: Record<string, Record<string, string>> = {
  handstand:   { beginner: 'handstand-beginners',  intermediate: 'freestanding-handstand' },
  flexibility: { beginner: 'basic-flexibility',    intermediate: 'splits-8-weeks' },
  strength:    { beginner: 'basic-calisthenics',   intermediate: 'basic-calisthenics' },
  health:      { beginner: 'back-rehabilitation',  intermediate: 'office-posture' },
}

/** Записує юзера на програму відповідно до цілі та рівня, відправляє email, редіректить на День 1. */
export async function onboardingAction(formData: FormData): Promise<void> {
  const locale = await getLocale()
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const goal  = formData.get('goal')  as string
  const level = formData.get('level') as string

  const slug = GOAL_LEVEL_TO_SLUG[goal]?.[level]
  if (!slug) redirect(`/${locale}/dashboard`)

  const program = await getProgramBySlug(slug)
  if (!program) redirect(`/${locale}/dashboard`)

  await enrollProgram(user.id, program.id)

  const day1Url    = `/${locale}/programs/${slug}/w1/d1`
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

}
