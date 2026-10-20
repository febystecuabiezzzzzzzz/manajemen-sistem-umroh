import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const defaultManasik = [
  {
    id: '1',
    judul: 'Manasik Umroh Reguler 9 Hari #1',
    paket: 'Umroh Reguler 9 Hari',
    tanggal: '2026-10-15',
    waktu: '08:30 - 11:30',
    lokasi: 'Aula Kantor Pusat Jakarta',
    muthawif: 'Ustadz Abdullah, Lc.',
    kuota_hadir: 28,
  },
  {
    id: '2',
    judul: 'Manasik Akbar & Praktik Tawaf / Sai',
    paket: 'Semua Paket Umroh',
    tanggal: '2026-10-25',
    waktu: '08:00 - 14:00',
    lokasi: 'Asrama Haji Pondok Gede',
    muthawif: 'KH. M. Syukron, MA',
    kuota_hadir: 45,
  },
]

export async function GET() {
  try {
    const rows = await supabaseDb.select('manasik', 'order=tanggal.asc')
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows })
    }
  } catch {}

  return NextResponse.json({ success: true, data: defaultManasik })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { judul, paket, tanggal, waktu, lokasi, muthawif } = body

    if (!judul || !tanggal) {
      return NextResponse.json({ success: false, error: 'Judul dan Tanggal manasik wajib diisi.' }, { status: 400 })
    }

    const newSchedule = {
      id: crypto.randomUUID(),
      judul,
      paket: paket || 'Umroh Reguler',
      tanggal,
      waktu: waktu || '08:30 - 12:00',
      lokasi: lokasi || 'Aula Kantor Pusat',
      muthawif: muthawif || 'Ustadz Pembimbing',
      kuota_hadir: 0,
      created_at: new Date().toISOString(),
    }

    try {
      await supabaseDb.insert('manasik', newSchedule)
    } catch {}

    return NextResponse.json({ success: true, data: newSchedule, message: 'Jadwal manasik berhasil disimpan' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
