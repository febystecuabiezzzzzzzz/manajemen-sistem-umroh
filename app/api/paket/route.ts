import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

// GET /api/paket
export async function GET(req: NextRequest) {
  try {
    const rows = await supabaseDb.select('paket', 'order=tanggal_berangkat.asc')
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/paket
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let { kode, nama, tipe, durasi_hari, harga, kuota, tanggal_berangkat, hotel_makkah, hotel_madinah, status } = body

    if (!nama) {
      return NextResponse.json({ success: false, error: 'Nama paket wajib diisi.' }, { status: 400 })
    }

    if (!kode || !kode.trim()) {
      kode = 'PKT-' + (nama.substring(0, 3).toUpperCase()) + '-' + Date.now().toString().slice(-4)
    }

    if (!harga) {
      harga = 28500000
    }

    if (!tanggal_berangkat) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      tanggal_berangkat = futureDate.toISOString().split('T')[0]
    }

    const data = await supabaseDb.insert('paket', {
      id: crypto.randomUUID(),
      kode: kode.trim(),
      nama: nama.trim(),
      tipe: tipe || 'Umroh',
      durasi_hari: Number(durasi_hari || 9),
      harga: Number(harga),
      kuota: Number(kuota || 45),
      terisi: 0,
      tanggal_berangkat,
      hotel_makkah: hotel_makkah || 'Hotel Makkah Bintang 5',
      hotel_madinah: hotel_madinah || 'Hotel Madinah Bintang 5',
      status: status || 'Aktif',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
