import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { db } from './db'

const cookieName = 'umroh_session'
const sessionDuration = 60 * 60 * 8 // 8 jam
const rememberedSessionDuration = 60 * 60 * 24 * 30 // 30 hari

function sessionSecret() {
  const secret = process.env.SESSION_SECRET || 'secret-salt-key-manajemen-umroh-haji-2026-super-secure'
  return secret
}

function sign(payload: string) {
  return createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
}

export async function createSession(userId: number | string, remember = false) {
  const maxAge = remember ? rememberedSessionDuration : sessionDuration
  const expiresAt = Math.floor(Date.now() / 1000) + maxAge
  const sessionId = randomBytes(32).toString('hex')

  try {
    await db.execute('DELETE FROM next_sessions WHERE expires_at <= NOW()')
    await db.execute(
      'INSERT INTO next_sessions (id, user_id, expires_at) VALUES (?, ?, FROM_UNIXTIME(?))',
      [sessionId, Number(userId), expiresAt]
    )
  } catch (err) {
    console.error('Failed to save session to DB:', err)
  }

  const payload = Buffer.from(
    JSON.stringify({ id: Number(userId), exp: expiresAt, sid: sessionId })
  ).toString('base64url')

  const jar = await cookies()
  jar.set(cookieName, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  })
}

export async function clearSession() {
  const jar = await cookies()
  const rawCookie = jar.get(cookieName)?.value
  const session = readSession(rawCookie)
  if (session) {
    try {
      await db.execute('DELETE FROM next_sessions WHERE id = ? AND user_id = ?', [
        session.sid,
        session.id,
      ])
    } catch {}
  }
  jar.delete(cookieName)
}

function readSession(token?: string) {
  if (!token) return null

  const [payload, signature, ...extra] = token.split('.')
  if (!payload || !signature || extra.length) return null

  const expected = Buffer.from(sign(payload))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

  let session: any
  try {
    session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    return null
  }

  if (
    !Number.isSafeInteger(session.id) ||
    session.id < 1 ||
    typeof session.sid !== 'string' ||
    !/^[a-f0-9]{64}$/.test(session.sid) ||
    !Number.isSafeInteger(session.exp) ||
    session.exp <= Date.now() / 1000
  ) {
    return null
  }

  return session
}

export async function getCurrentUser() {
  try {
    const jar = await cookies()
    const session = readSession(jar.get(cookieName)?.value)
    if (!session) return null

    const rows = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.branch_id, u.phone, b.name as branch_name
       FROM next_sessions s 
       JOIN users u ON u.id = s.user_id
       LEFT JOIN branches b ON b.id = u.branch_id
       WHERE s.id = ? AND s.user_id = ? AND s.expires_at > NOW()
         AND u.is_active = 1 AND u.deleted_at IS NULL LIMIT 1`,
      [session.sid, session.id]
    )
    return rows[0] || null
  } catch {
    return null
  }
}
