'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'

export async function registerAction(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: { full_name: formData.get('name') as string },
    },
  })

  const locale = await getLocale()

  if (error) redirect(`/${locale}/register?error=` + encodeURIComponent(error.message))

  revalidatePath('/', 'layout')
  redirect(`/${locale}/dashboard`)
}
