import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  // Refresh Supabase session cookies
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const [, locale, ...rest] = pathname.split('/')
  const path = '/' + rest.join('/')

  const isAuthPage = ['/login', '/register'].some(p => path.startsWith(p))
  const isProtectedPage = !isAuthPage && path !== '/'

  if (user && isAuthPage)
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))

  if (!user && isProtectedPage)
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))

  // Run next-intl locale routing
  const intlResponse = intlMiddleware(request)

  // Forward any refreshed Supabase cookies to the intl response
  supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
    intlResponse.cookies.set(name, value)
  })

  return intlResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}

