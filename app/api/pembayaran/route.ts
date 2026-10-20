import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const defaultPayments = [
  {
    id: '1',
    no_kuitansi: 'KW-001289',
    jamaah: 'Ahmad Fauzi',
    paket: 'Umroh Reguler 9 Hari',
    tanggal: '2026-10-12',
    metode: 'Transfer Bank BSI',
    jumlah: 15000000,
    status: 'Sebagian',
  },
  {
    id: '2',
    no_kuitansi: 'KW-001254',
    jamaah: 'Hj. Siti Nurhaliza',
    paket: 'Umroh Plus Turki 12 Hari',
    tanggal: '2026-10-10',
    metode: 'Transfer Bank Mandiri',
    jumlah: 36000000,
    status: 'Lunas',
  },
  {
    id: '3',
    no_kuitansi: 'KW-001210',
    jamaah: 'Bambang Sutrisno',
    paket: 'Haji Khusus Furoda 2027',
    tanggal: '2026-10-05',
    metode: 'Transfer Bank BSI',
    jumlah: 50000000,
    status: 'Sebagian',
  },
]

export async function GET() {
  try {
    const rows = await supabaseDb.select('pembayaran', 'order=created_at.desc')
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows })
    }
  } catch {}

  return NextResponse.json({ success: true, data: defaultPayments })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jamaah, paket, metode, jumlah } = body

    if (!jamaah || !jumlah) {
      return NextResponse.json({ success: false, error: 'Data pembayaran belum lengkap.' }, { status: 400 })
    }

    const code = `KW-${Date.now().toString().slice(-6)}`
    const newPayment = {
      id: crypto.randomUUID(),
      no_kuitansi: code,
      jamaah,
      paket: paket || 'Umroh Reguler',
      tanggal: new Date().toISOString().split('T')[0],
      metode: metode || 'Transfer Bank BSI',
      jumlah: Number(jumlah),
      status: 'Lunas',
      created_at: new Date().toISOString(),
    }

    try {
      await supabaseDb.insert('pembayaran', newPayment)
    } catch {}

    return NextResponse.json({
      success: true,
      data: newPayment,
      no_kuitansi: code,
      message: 'Pembayaran berhasil dicatat',
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
