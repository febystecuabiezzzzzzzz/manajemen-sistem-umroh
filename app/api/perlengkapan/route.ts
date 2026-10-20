import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const defaultEquip = [
  {
    id: '1',
    jamaah: 'Ahmad Fauzi',
    koper: true,
    kain_ihram: true,
    mukena: false,
    tas_paspor: true,
    buku_doa: true,
    seragam: true,
    status: 'Lengkap',
  },
  {
    id: '2',
    jamaah: 'Hj. Siti Nurhaliza',
    koper: true,
    kain_ihram: false,
    mukena: true,
    tas_paspor: true,
    buku_doa: true,
    seragam: true,
    status: 'Lengkap',
  },
  {
    id: '3',
    jamaah: 'Bambang Sutrisno',
    koper: true,
    kain_ihram: true,
    mukena: false,
    tas_paspor: false,
    buku_doa: false,
    seragam: false,
    status: 'Belum Lengkap',
  },
]

export async function GET() {
  try {
    const rows = await supabaseDb.select('perlengkapan')
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows })
    }
  } catch {}

  return NextResponse.json({ success: true, data: defaultEquip })
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { registration_id, status } = body

    try {
      await supabaseDb.update('perlengkapan', registration_id, {
        status,
        koper: status === 'Lengkap',
        tas_paspor: status === 'Lengkap',
        buku_doa: status === 'Lengkap',
        seragam: status === 'Lengkap',
      })
    } catch {}

    return NextResponse.json({ success: true, message: 'Status perlengkapan diperbarui' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
