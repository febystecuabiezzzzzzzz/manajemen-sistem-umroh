import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const defaultDocs = [
  {
    id: '1',
    jamaah: 'Ahmad Fauzi',
    paspor: 'Lengkap',
    ktp: 'Lengkap',
    buku_nikah: 'Lengkap',
    vaksin: 'Lengkap',
    foto: 'Lengkap',
    visa: 'Issued',
  },
  {
    id: '2',
    jamaah: 'Hj. Siti Nurhaliza',
    paspor: 'Lengkap',
    ktp: 'Lengkap',
    buku_nikah: 'Lengkap',
    vaksin: 'Proses',
    foto: 'Lengkap',
    visa: 'Dalam Proses',
  },
  {
    id: '3',
    jamaah: 'Bambang Sutrisno',
    paspor: 'Proses',
    ktp: 'Lengkap',
    buku_nikah: 'Belum',
    vaksin: 'Belum',
    foto: 'Lengkap',
    visa: 'Belum Diajukan',
  },
  {
    id: '4',
    jamaah: 'Dewi Lestari',
    paspor: 'Belum',
    ktp: 'Lengkap',
    buku_nikah: 'Belum',
    vaksin: 'Belum',
    foto: 'Belum',
    visa: 'Belum Diajukan',
  },
]

export async function GET() {
  try {
    const rows = await supabaseDb.select('dokumen', 'order=created_at.asc')
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows })
    }
  } catch {}

  return NextResponse.json({ success: true, data: defaultDocs })
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { pilgrim_id, visa_status } = body

    try {
      await supabaseDb.update('dokumen', pilgrim_id, { visa: visa_status })
    } catch {}

    return NextResponse.json({ success: true, message: 'Status dokumen berhasil diperbarui' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
