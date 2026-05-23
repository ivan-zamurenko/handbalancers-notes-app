'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getLocale } from 'next-intl/server'
import { signIn, signOut } from '@/lib/db/auth'

export async function loginAction(formData: FormData) {
  const locale = await getLocale()
  let authError: string | null = null

  try {
    await signIn(
      formData.get('email') as string,
      formData.get('password') as string,
    )
  } catch (err: unknown) {
    authError = err instanceof Error ? err.message : 'Login failed'
  }

  if (authError) redirect(`/${locale}/login?error=` + encodeURIComponent(authError))

  revalidatePath('/', 'layout')
  redirect(`/${locale}/dashboard`)
}

export async function logoutAction(): Promise<void> {
  await signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
