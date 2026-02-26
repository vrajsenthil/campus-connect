import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const COOKIE_NAME = 'admin_session'
const SALT = 'unilink_admin_salt'

function getAuthToken(password: string): string {
  return createHash('sha256').update(password + SALT).digest('hex')
}

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD?.trim()
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'Admin login is not configured. Set ADMIN_PASSWORD in environment.' },
      { status: 500 }
    )
  }

  const body = await request.json().catch(() => ({}))
  const { password, redirectTo } = body
  const redirect = typeof redirectTo === 'string' && redirectTo.startsWith('/admin') ? redirectTo : '/admin'

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = getAuthToken(adminPassword)
  const res = NextResponse.json({ success: true, redirect })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
