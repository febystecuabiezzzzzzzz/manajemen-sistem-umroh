import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const defaultRooms = [
  {
    id: '1',
    kamar: 'Room 501',
    tipe: 'Quad',
    hotel: 'Pullman Zamzam Makkah',
    jamaah: ['Ahmad Fauzi', 'H. Sudirman', 'Bambang Sutrisno', 'Muhammad Ridwan'],
  },
  {
    id: '2',
    kamar: 'Room 502',
    tipe: 'Triple',
    hotel: 'Pullman Zamzam Makkah',
    jamaah: ['Hj. Siti Nurhaliza', 'Hj. Aminah', 'Dewi Lestari'],
  },
  {
    id: '3',
    kamar: 'Room 304',
    tipe: 'Double',
    hotel: 'Dallah Taibah Madinah',
    jamaah: ['Ahmad Fauzi', 'H. Sudirman'],
  },
]

export async function GET() {
  try {
    const rows = await supabaseDb.select('manifest')
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows })
    }
  } catch {}

  return NextResponse.json({ success: true, data: defaultRooms })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { kamar, tipe, hotel, jamaah } = body

    const newRoom = {
      id: crypto.randomUUID(),
      kamar,
      tipe: tipe || 'Quad',
      hotel: hotel || 'Pullman Zamzam Makkah',
      jamaah: Array.isArray(jamaah) ? jamaah : [jamaah],
      created_at: new Date().toISOString(),
    }

    try {
      await supabaseDb.insert('manifest', newRoom)
    } catch {}

    return NextResponse.json({ success: true, data: newRoom })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
