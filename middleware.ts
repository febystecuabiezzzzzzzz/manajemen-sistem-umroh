import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const adminSubroutes = [
  'cabang', 'paket', 'hotel', 'maskapai', 'rekening', 'agen', 'muthawif',
  'jamaah', 'pendaftaran', 'dokumen', 'pembayaran', 'manasik', 'manifest',
  'perlengkapan', 'komisi', 'pengumuman', 'pengguna', 'whitelabel', 'log'
]

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const pathname = request.nextUrl.pathname
  const demoRole = request.cookies.get('demo_role')?.value

  // Support shorthand routing like /dashboard/cabang -> /dashboard/admin/cabang
  // but only if not already in role namespace (/dashboard/admin, /dashboard/jamaah, /dashboard/muthawif)
  if (
    !pathname.startsWith('/dashboard/admin') &&
    !pathname.startsWith('/dashboard/agent') &&
    !pathname.startsWith('/dashboard/jamaah') &&
    !pathname.startsWith('/dashboard/muthawif')
  ) {
    for (const sub of adminSubroutes) {
      if (pathname === `/dashboard/${sub}` || pathname.startsWith(`/dashboard/${sub}/`)) {
        const rest = pathname.replace(`/dashboard/${sub}`, '')
        return NextResponse.redirect(new URL(`/dashboard/admin/${sub}${rest}`, request.url))
      }
    }
  }

  // Public paths that don't require auth
  const publicPaths = ['/login', '/auth/callback', '/api']
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return supabaseResponse
  }

  // If demo role is active
  if (demoRole) {
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL(`/dashboard/${demoRole}`, request.url))
    }
    return supabaseResponse
  }

  // Check Supabase Auth
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based routing
    if (pathname.startsWith('/dashboard')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role || 'jamaah'

      if (pathname === '/dashboard') {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
      }

      if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
      }
      if (
        pathname.startsWith('/dashboard/muthawif') &&
        role !== 'muthawif' &&
        role !== 'admin'
      ) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
      }
      if (
        pathname.startsWith('/dashboard/jamaah') &&
        role !== 'jamaah' &&
        role !== 'admin'
      ) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
      }
    }
  } catch {
    if (!demoRole) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
