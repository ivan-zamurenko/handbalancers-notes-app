import { getProfile, getUser, signIn, signOut, signUp } from '@/lib/db/auth'
import type { Profile } from '@/types'

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
  name: string
}

// Pattern: Facade
export async function loginWithEmail(input: LoginInput): Promise<void> {
  await signIn(input.email, input.password)
}

// Pattern: Facade
export async function registerWithEmail(input: RegisterInput): Promise<void> {
  await signUp(input.email, input.password, input.name)
}

// Pattern: Facade
export async function logoutCurrentUser(): Promise<void> {
  await signOut()
}

// Pattern: Facade
export async function getCurrentUser() {
  return getUser()
}

// Pattern: Facade
export async function getCurrentUserProfile(userId: string): Promise<Profile | null> {
  return getProfile(userId)
}