import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'admin_session'
const SALT = 'unilink_admin_salt'

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  if (pathname.startsWith('/admin')) {
    const adminPassword = process.env.ADMIN_PASSWORD?.trim()
    if (!adminPassword) return NextResponse.next()

    const token = request.cookies.get(COOKIE_NAME)?.value
    const expected = await sha256Hex(adminPassword + SALT)
    if (token !== expected) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/bookings', '/admin/login'],
}
