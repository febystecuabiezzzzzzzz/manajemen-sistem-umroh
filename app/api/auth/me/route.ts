import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  let clientRole = 'admin'
  if (user.role === 'guide') clientRole = 'muthawif'
  else if (user.role === 'pilgrim') clientRole = 'jamaah'

  return NextResponse.json({
    authenticated: true,
    user: {
      ...user,
      clientRole,
    },
  })
}
