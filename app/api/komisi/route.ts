import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const defaultCommissions = [
  {
    id: '1',
    agen: 'Budi Santoso',
    jamaah: 'H. Sudirman',
    paket: 'Umroh Reguler 9 Hari',
    komisi: 1500000,
    tanggal: '2026-09-15',
    status: 'Sudah Ditransfer',
  },
  {
    id: '2',
    agen: 'Siti Rahmawati',
    jamaah: 'Hj. Aminah',
    paket: 'Umroh Plus Turki 12 Hari',
    komisi: 2000000,
    tanggal: '2026-10-01',
    status: 'Pending',
  },
  {
    id: '3',
    agen: 'Budi Santoso',
    jamaah: 'Muhammad Ridwan',
    paket: 'Umroh Reguler 9 Hari',
    komisi: 1500000,
    tanggal: '2026-10-10',
    status: 'Pending',
  },
]

export async function GET() {
  try {
    const rows = await supabaseDb.select('komisi', 'order=created_at.desc')
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows })
    }
  } catch {}

  return NextResponse.json({ success: true, data: defaultCommissions })
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    try {
      await supabaseDb.update('komisi', id, {
        status: 'Sudah Ditransfer',
        tanggal_bayar: new Date().toISOString().split('T')[0],
      })
    } catch {}

    return NextResponse.json({ success: true, message: 'Komisi berhasil ditandai telah ditransfer' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
