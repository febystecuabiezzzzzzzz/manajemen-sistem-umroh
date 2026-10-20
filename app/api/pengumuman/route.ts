import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const defaultAnnouncements = [
  {
    id: '1',
    judul: 'Pelunasan Umroh Reguler Musim 1448H',
    isi: 'Batas akhir pembayaran pelunasan paket reguler adalah H-30 sebelum keberangkatan.',
    target: 'Jamaah',
    tanggal: '04 Okt 2026',
  },
  {
    id: '2',
    judul: 'Jadwal Manasik Akbar & Praktik Lapangan',
    isi: 'Manasik akbar akan dilaksanakan di Asrama Haji Pondok Gede. Seluruh jamaah wajib hadir.',
    target: 'Semua Pengguna',
    tanggal: '03 Okt 2026',
  },
  {
    id: '3',
    judul: 'Update Skema Komisi & Insentif Agen',
    isi: 'Dapatkan insentif tambahan untuk setiap pendaftaran paket akhir tahun.',
    target: 'Agen',
    tanggal: '01 Okt 2026',
  },
]

export async function GET() {
  try {
    const rows = await supabaseDb.select('pengumuman', 'order=created_at.desc')
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows })
    }
  } catch {}

  return NextResponse.json({ success: true, data: defaultAnnouncements })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { judul, isi, target } = body

    if (!judul || !isi) {
      return NextResponse.json({ success: false, error: 'Judul dan Isi pengumuman wajib diisi.' }, { status: 400 })
    }

    const newAnnouncement = {
      id: crypto.randomUUID(),
      judul,
      isi,
      target: target || 'Semua Pengguna',
      tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      created_at: new Date().toISOString(),
    }

    try {
      await supabaseDb.insert('pengumuman', newAnnouncement)
    } catch {}

    return NextResponse.json({ success: true, data: newAnnouncement, message: 'Pengumuman berhasil diterbitkan' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
