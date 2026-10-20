import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth'

export async function POST() {
  await clearSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('demo_role')
  res.cookies.delete('umroh_session')
  return res
}
