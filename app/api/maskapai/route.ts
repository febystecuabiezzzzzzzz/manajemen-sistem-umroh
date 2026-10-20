import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

export async function GET() {
  try {
    const rows = await supabaseDb.select('maskapai', 'order=nama.asc')
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { kode, nama, rute, tipe_penerbangan } = body

    if (!kode || !nama || !rute) {
      return NextResponse.json({ success: false, error: 'Kode, nama, dan rute maskapai wajib diisi.' }, { status: 400 })
    }

    const data = await supabaseDb.insert('maskapai', {
      id: crypto.randomUUID(),
      kode, nama, rute,
      tipe_penerbangan: tipe_penerbangan || 'Direct',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
