import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

export async function GET() {
  try {
    const rows = await supabaseDb.select('pendaftaran', 'order=tanggal_daftar.desc')
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nomor_registrasi, jamaah_nama, paket_nama, cabang_nama, tanggal_daftar, total_biaya, sudah_bayar, status } = body

    if (!jamaah_nama || !paket_nama) {
      return NextResponse.json({ success: false, error: 'Nama jamaah dan paket wajib diisi.' }, { status: 400 })
    }

    const data = await supabaseDb.insert('pendaftaran', {
      id: crypto.randomUUID(),
      nomor_registrasi: nomor_registrasi || `REG-${Date.now()}`,
      jamaah_nama, paket_nama,
      cabang_nama: cabang_nama || 'Kantor Pusat',
      tanggal_daftar: tanggal_daftar || new Date().toISOString().split('T')[0],
      total_biaya: Number(total_biaya || 0),
      sudah_bayar: Number(sudah_bayar || 0),
      status: status || 'Menunggu',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
