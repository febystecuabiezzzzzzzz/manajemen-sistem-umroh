import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

export async function GET() {
  try {
    const rows = await supabaseDb.select('agen', 'order=nama.asc')
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { kode, nama, telepon, email, kota, komisi_per_jamaah, status } = body

    if (!kode || !nama) {
      return NextResponse.json({ success: false, error: 'Kode dan nama agen wajib diisi.' }, { status: 400 })
    }

    const data = await supabaseDb.insert('agen', {
      id: crypto.randomUUID(),
      kode, nama,
      telepon: telepon || null,
      email: email || null,
      kota: kota || null,
      komisi_per_jamaah: Number(komisi_per_jamaah || 1500000),
      total_jamaah: 0,
      status: status || 'Aktif',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
