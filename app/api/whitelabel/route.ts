import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

const defaultSettings = {
  namaTravel: 'Travel Umroh & Haji',
  tagline: 'Sistem Manajemen Umroh & Haji Terpadu',
  warnaPrimer: '#0d9488',
  warnaSekunder: '#0f766e',
  teleponCS: '0812-3456-7890',
  emailSupport: 'support@travelumroh.com',
  alamatPusat: 'Jl. Sudirman No. 45, Jakarta Pusat',
  footerCopyright: '© 2026 Travel Umroh & Haji — All Rights Reserved.',
}

export async function GET() {
  try {
    const rows = await supabaseDb.select('settings')
    if (rows && rows.length > 0) {
      const settingsMap: Record<string, string> = {}
      for (const r of rows) {
        settingsMap[r.key] = r.value
      }
      return NextResponse.json({
        success: true,
        data: {
          ...defaultSettings,
          namaTravel: settingsMap['app_name'] || defaultSettings.namaTravel,
          tagline: settingsMap['app_subtitle'] || defaultSettings.tagline,
          warnaPrimer: settingsMap['brand_color'] || defaultSettings.warnaPrimer,
          teleponCS: settingsMap['phone'] || defaultSettings.teleponCS,
          emailSupport: settingsMap['email'] || defaultSettings.emailSupport,
          alamatPusat: settingsMap['address'] || defaultSettings.alamatPusat,
        },
      })
    }
  } catch {}

  return NextResponse.json({ success: true, data: defaultSettings })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { namaTravel, tagline, warnaPrimer, teleponCS, emailSupport, alamatPusat } = body

    const pairs = [
      { key: 'app_name', value: String(namaTravel || '') },
      { key: 'app_subtitle', value: String(tagline || '') },
      { key: 'brand_color', value: String(warnaPrimer || '') },
      { key: 'phone', value: String(teleponCS || '') },
      { key: 'email', value: String(emailSupport || '') },
      { key: 'address', value: String(alamatPusat || '') },
    ]

    for (const item of pairs) {
      try {
        await supabaseDb.insert('settings', item)
      } catch {}
    }

    return NextResponse.json({ success: true, message: 'Pengaturan white-label berhasil disimpan' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
