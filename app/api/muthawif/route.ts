import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

export async function GET() {
  try {
    const rows = await supabaseDb.select('muthawif', 'order=nama.asc')
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nama, telepon, email, bahasa, pengalaman_tahun, status } = body

    if (!nama) {
      return NextResponse.json({ success: false, error: 'Nama muthawif wajib diisi.' }, { status: 400 })
    }

    const data = await supabaseDb.insert('muthawif', {
      id: crypto.randomUUID(),
      nama,
      telepon: telepon || null,
      email: email || null,
      bahasa: bahasa || 'Indonesia, Arab',
      pengalaman_tahun: Number(pengalaman_tahun || 5),
      status: status || 'Aktif',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
