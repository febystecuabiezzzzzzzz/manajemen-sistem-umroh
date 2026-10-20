import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

// GET /api/cabang
export async function GET() {
  try {
    const rows = await supabaseDb.select('cabang', 'order=is_pusat.desc,created_at.asc')
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/cabang
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let { kode, nama, telepon, email, kota, alamat, aktif, is_pusat } = body

    if (!nama) {
      return NextResponse.json({ success: false, error: 'Nama cabang wajib diisi.' }, { status: 400 })
    }

    if (!kode || !kode.trim()) {
      kode = 'CBG-' + nama.substring(0, 3).toUpperCase()
    }

    const data = await supabaseDb.insert('cabang', {
      id: crypto.randomUUID(),
      kode: kode.trim().toUpperCase(),
      nama: nama.trim(),
      telepon: telepon || '-',
      email: email || '-',
      kota: kota || 'Jakarta',
      alamat: alamat || '-',
      aktif: aktif !== false,
      is_pusat: is_pusat === true,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
