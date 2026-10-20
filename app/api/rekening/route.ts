import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

export async function GET() {
  try {
    const rows = await supabaseDb.select('rekening', 'order=created_at.asc')
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nama_bank, nomor_rekening, atas_nama, cabang_bank, aktif } = body

    if (!nama_bank || !nomor_rekening || !atas_nama) {
      return NextResponse.json({ success: false, error: 'Nama bank, nomor rekening, dan atas nama wajib diisi.' }, { status: 400 })
    }

    const data = await supabaseDb.insert('rekening', {
      id: crypto.randomUUID(),
      nama_bank, nomor_rekening, atas_nama,
      cabang_bank: cabang_bank || null,
      aktif: aktif !== false,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
