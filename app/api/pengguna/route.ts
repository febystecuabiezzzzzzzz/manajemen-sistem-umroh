import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const defaultUsers = [
  {
    id: '1',
    nama: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'Super Admin',
    status: 'Aktif',
  },
  {
    id: '2',
    nama: 'Staf Operasional Jakarta',
    email: 'staff@example.com',
    role: 'Staf Operasional',
    status: 'Aktif',
  },
  {
    id: '3',
    nama: 'Budi Santoso',
    email: 'agen@example.com',
    role: 'Agen',
    status: 'Aktif',
  },
  {
    id: '4',
    nama: 'Ustadz Abdullah, Lc.',
    email: 'muthawif@example.com',
    role: 'Muthawif',
    status: 'Aktif',
  },
  {
    id: '5',
    nama: 'Ahmad Fauzi',
    email: 'jamaah@example.com',
    role: 'Jamaah',
    status: 'Aktif',
  },
]

export async function GET() {
  try {
    const rows = await supabaseDb.select('pengguna', 'order=created_at.asc')
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows })
    }
  } catch {}

  return NextResponse.json({ success: true, data: defaultUsers })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nama, email, role } = body

    if (!nama || !email) {
      return NextResponse.json({ success: false, error: 'Nama dan Email wajib diisi.' }, { status: 400 })
    }

    const newUser = {
      id: crypto.randomUUID(),
      nama,
      email,
      role: role || 'Staf Operasional',
      status: 'Aktif',
      created_at: new Date().toISOString(),
    }

    try {
      await supabaseDb.insert('pengguna', newUser)
    } catch {}

    return NextResponse.json({ success: true, data: newUser, message: 'Pengguna baru berhasil ditambahkan' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
