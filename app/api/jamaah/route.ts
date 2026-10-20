import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

export async function GET() {
  try {
    const rows = await supabaseDb.select('jamaah', 'order=created_at.desc')
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let { nik, nama, jenis_kelamin, telepon, email, kota, paket_id, paket_nama, status_pendaftaran, status_pembayaran } = body

    if (!nama || typeof nama !== 'string' || !nama.trim()) {
      return NextResponse.json({ success: false, error: 'Nama jamaah wajib diisi.' }, { status: 400 })
    }

    // Auto-generate realistic NIK if user didn't enter one
    if (!nik || typeof nik !== 'string' || !nik.trim()) {
      nik = '3201' + Math.floor(100000000000 + Math.random() * 900000000000).toString()
    }

    if (!jenis_kelamin || (jenis_kelamin !== 'L' && jenis_kelamin !== 'P')) {
      jenis_kelamin = 'L'
    }

    const newRecord = {
      id: crypto.randomUUID(),
      nik: nik.trim(),
      nama: nama.trim(),
      jenis_kelamin,
      telepon: telepon ? String(telepon).trim() : '-',
      email: email ? String(email).trim() : '-',
      kota: kota ? String(kota).trim() : 'Jakarta',
      paket_id: paket_id || null,
      paket_nama: paket_nama || 'Umroh Reguler 9 Hari',
      status_pendaftaran: status_pendaftaran || 'Dikonfirmasi',
      status_pembayaran: status_pembayaran || 'Sebagian',
      created_at: new Date().toISOString(),
    }

    const data = await supabaseDb.insert('jamaah', newRecord)

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Gagal menyimpan data jamaah' }, { status: 500 })
  }
}
