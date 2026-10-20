import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

export async function GET() {
  try {
    const rows = await supabaseDb.select('hotel', 'order=kota.asc,nama.asc')
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nama, kota, bintang, jarak_masjid, alamat, telepon } = body

    if (!nama || !kota) {
      return NextResponse.json({ success: false, error: 'Nama dan kota hotel wajib diisi.' }, { status: 400 })
    }

    const data = await supabaseDb.insert('hotel', {
      id: crypto.randomUUID(),
      nama, kota,
      bintang: Number(bintang || 4),
      jarak_masjid: jarak_masjid || null,
      alamat: alamat || null,
      telepon: telepon || null,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
