'use server'
// Pattern: Service Layer — Server Actions як точка входу для мутацій програм
import { revalidatePath } from 'next/cache'
import { getUser } from '@/lib/db/auth'
import { enrollProgram } from '@/lib/db/programs'
import { hasActiveAccess } from '@/lib/db/subscriptions'

/** Записує поточного юзера на програму. Для платних — перевіряє підписку або trial. */
export async function enrollAction(programId: string, isFree: boolean): Promise<void> {
  const user = await getUser()
  if (!user) throw new Error('Unauthorized')

  if (!isFree) {
    const access = await hasActiveAccess(user.id)
    if (!access) throw new Error('Subscription required')
  }

  await enrollProgram(user.id, programId)
  revalidatePath('/', 'layout')
}
