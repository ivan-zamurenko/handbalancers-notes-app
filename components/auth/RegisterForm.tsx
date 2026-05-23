'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getLocale } from 'next-intl/server'
import { signUp } from '@/lib/db/auth'

export async function registerAction(formData: FormData) {
  const locale = await getLocale()
  let authError: string | null = null

  try {
    await signUp(
      formData.get('email') as string,
      formData.get('password') as string,
      formData.get('name') as string,
    )
  } catch (err: unknown) {
    authError = err instanceof Error ? err.message : 'Registration failed'
  }

  if (authError) redirect(`/${locale}/register?error=` + encodeURIComponent(authError))

  revalidatePath('/', 'layout')
  redirect(`/${locale}/dashboard`)
}
