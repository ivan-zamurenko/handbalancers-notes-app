'use server'
// Pattern: Service Layer — Server Actions як точка входу для мутацій програм
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/services/auth-service'
import { enrollProgram } from '@/lib/services/data'
import { userHasActiveAccess } from '@/lib/services/subscriptions'

/** Записує поточного юзера на програму. Для платних — перевіряє підписку або trial. */
export async function enrollAction(programId: string, isFree: boolean): Promise<void> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  if (!isFree) {
    const access = await userHasActiveAccess(user.id)
    if (!access) throw new Error('Subscription required')
  }

  await enrollProgram(user.id, programId)
  revalidatePath('/', 'layout')
}
