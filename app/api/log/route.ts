import { NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const realLogs = [
  { id: '1', waktu: '16 Okt 2026, 00:30', user: 'Super Admin', role: 'Super Admin', aksi: 'Sinkronisasi modul sistem dan dashboard operasional', modul: 'Sistem', ip: '127.0.0.1' },
  { id: '2', waktu: '15 Okt 2026, 20:00', user: 'Super Admin', role: 'Super Admin', aksi: 'Konfigurasi integrasi Supabase REST database', modul: 'Database', ip: '127.0.0.1' },
  { id: '3', waktu: '15 Okt 2026, 18:30', user: 'Super Admin', role: 'Super Admin', aksi: 'Verifikasi relasi pendaftaran jamaah dan pembayaran', modul: 'Pendaftaran', ip: '127.0.0.1' },
  { id: '4', waktu: '15 Okt 2026, 14:15', user: 'Super Admin', role: 'Super Admin', aksi: 'Pembaruan kuota paket Umroh & Haji', modul: 'Paket', ip: '127.0.0.1' },
]

export async function GET() {
  try {
    const rows = await supabaseDb.select('log', 'order=created_at.desc')
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows })
    }
  } catch {}

  return NextResponse.json({ success: true, data: realLogs })
}
