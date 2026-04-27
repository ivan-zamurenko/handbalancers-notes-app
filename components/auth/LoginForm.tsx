'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  const locale = await getLocale()

  if (error) redirect(`/${locale}/login?error=` + encodeURIComponent(error.message))

  revalidatePath('/', 'layout')
  redirect(`/${locale}/dashboard`)
}
