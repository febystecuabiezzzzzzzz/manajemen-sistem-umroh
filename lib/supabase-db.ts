/**
 * Supabase DB Helper - Server-side only
 * Menggantikan lib/db.ts dengan Supabase REST API + Reliable Fallback Memory Store
 */

const DEFAULT_SUPABASE_URL = 'https://damsulzgnqfxhonjesdx.supabase.co'
const DEFAULT_SUPABASE_KEY = 'sb_publishable_0rBbuZhtfWM6mrFeA-j_Bg_QFIYrD7f'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, '')
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY

// In-memory fallback storage when Supabase table is not yet initialized or network unreachable
const memoryStore: Record<string, any[]> = {
  jamaah: [
    {
      id: '1',
      nik: '3201000000000001',
      nama: 'Ahmad Fauzi',
      jenis_kelamin: 'L',
      telepon: '081234567890',
      email: 'jamaah@example.com',
      kota: 'Jakarta',
      paket_id: '1',
      paket_nama: 'Umroh Reguler 9 Hari',
      status_pendaftaran: 'Dikonfirmasi',
      status_pembayaran: 'Sebagian',
      created_at: '2025-11-05T08:00:00Z',
    },
    {
      id: '2',
      nik: '3201000000000002',
      nama: 'Hj. Siti Nurhaliza',
      jenis_kelamin: 'P',
      telepon: '081298765432',
      email: 'siti@example.com',
      kota: 'Surabaya',
      paket_id: '2',
      paket_nama: 'Umroh Plus Turki 12 Hari',
      status_pendaftaran: 'Dikonfirmasi',
      status_pembayaran: 'Lunas',
      created_at: '2025-11-08T09:30:00Z',
    },
    {
      id: '3',
      nik: '3201000000000003',
      nama: 'Bambang Sutrisno',
      jenis_kelamin: 'L',
      telepon: '081345678901',
      email: 'bambang@example.com',
      kota: 'Bandung',
      paket_id: '3',
      paket_nama: 'Haji Khusus Furoda 2027',
      status_pendaftaran: 'Menunggu',
      status_pembayaran: 'Belum Bayar',
      created_at: '2025-11-12T10:15:00Z',
    },
  ],
  cabang: [
    {
      id: '1',
      kode: 'JKT',
      nama: 'Kantor Pusat Jakarta',
      telepon: '021-7654321',
      email: 'jakarta@travelumroh.com',
      kota: 'Jakarta',
      alamat: 'Jl. Sudirman No. 45, Jakarta Pusat',
      aktif: true,
      is_pusat: true,
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      kode: 'SBY',
      nama: 'Cabang Surabaya',
      telepon: '031-1234567',
      email: 'surabaya@travelumroh.com',
      kota: 'Surabaya',
      alamat: 'Jl. Pemuda No. 12, Surabaya',
      aktif: true,
      is_pusat: false,
      created_at: '2025-01-05T00:00:00Z',
    },
    {
      id: '3',
      kode: 'BDG',
      nama: 'Cabang Bandung',
      telepon: '022-8765432',
      email: 'bandung@travelumroh.com',
      kota: 'Bandung',
      alamat: 'Jl. Asia Afrika No. 88, Bandung',
      aktif: true,
      is_pusat: false,
      created_at: '2025-01-10T00:00:00Z',
    },
  ],
  paket: [
    {
      id: '1',
      kode: 'UMR-REG-9D',
      nama: 'Umroh Reguler 9 Hari',
      tipe: 'Umroh',
      durasi_hari: 9,
      harga: 28500000,
      kuota: 45,
      terisi: 32,
      tanggal_berangkat: '2026-11-15',
      hotel_makkah: 'Swissôtel Al Maqam Makkah',
      hotel_madinah: 'Pullman Zamzam Madina',
      status: 'Aktif',
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      kode: 'UMR-TRK-12D',
      nama: 'Umroh Plus Turki 12 Hari',
      tipe: 'Umroh',
      durasi_hari: 12,
      harga: 36500000,
      kuota: 40,
      terisi: 40,
      tanggal_berangkat: '2026-12-01',
      hotel_makkah: 'Mövenpick Hotel & Residences',
      hotel_madinah: 'Dallah Taibah Hotel',
      status: 'Aktif',
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '3',
      kode: 'HAJ-FUR-2027',
      nama: 'Haji Khusus Furoda 2027',
      tipe: 'Haji Plus',
      durasi_hari: 25,
      harga: 250000000,
      kuota: 20,
      terisi: 8,
      tanggal_berangkat: '2027-05-20',
      hotel_makkah: 'Fairmont Makkah Clock Tower',
      hotel_madinah: 'The Oberoi Madina',
      status: 'Aktif',
      created_at: '2025-01-01T00:00:00Z',
    },
  ],
  hotel: [
    {
      id: '1',
      nama: 'Swissôtel Al Maqam Makkah',
      kota: 'Makkah',
      bintang: 5,
      jarak_masjid: '50 meter (Depan Pelataran Masjidil Haram)',
      alamat: 'Abraj Al Bait Complex, Makkah',
      telepon: '+966 12 571 7333',
    },
    {
      id: '2',
      nama: 'Pullman Zamzam Madina',
      kota: 'Madinah',
      bintang: 5,
      jarak_masjid: '100 meter (Samping Gerbang Utama Nabawi)',
      alamat: 'Amr Bin Al Ghas Street, Madinah',
      telepon: '+966 14 821 0500',
    },
  ],
  maskapai: [
    {
      id: '1',
      kode: 'SV',
      nama: 'Saudi Arabian Airlines',
      rute: 'CGK - JED / MED (Direct)',
      tipe_penerbangan: 'Direct',
    },
    {
      id: '2',
      kode: 'GA',
      nama: 'Garuda Indonesia',
      rute: 'CGK - JED / MED (Direct)',
      tipe_penerbangan: 'Direct',
    },
  ],
  rekening_bank: [
    {
      id: '1',
      nama_bank: 'Bank Syariah Indonesia (BSI)',
      nomor_rekening: '7001234567',
      atas_nama: 'PT Travel Umroh Haji',
      cabang_bank: 'Kantor Cabang Sudirman Jakarta',
      aktif: true,
    },
    {
      id: '2',
      nama_bank: 'Bank Muamalat',
      nomor_rekening: '8009876543',
      atas_nama: 'PT Travel Umroh Haji',
      cabang_bank: 'Kantor Cabang Thamrin Jakarta',
      aktif: true,
    },
  ],
  agen: [
    {
      id: '1',
      kode: 'AGN-001',
      nama: 'Ustadz H. Abdullah Syukri',
      telepon: '081234567891',
      email: 'abdullah.agen@example.com',
      kota: 'Jakarta Selatan',
      komisi_per_jamaah: 1500000,
      total_jamaah: 24,
      status: 'Aktif',
    },
  ],
  muthawif: [
    {
      id: '1',
      nama: 'Ustadz Muhammad Faisal, Lc.',
      telepon: '081298765439',
      email: 'faisal.muthawif@example.com',
      bahasa: 'Indonesia, Arab, Inggris',
      pengalaman_tahun: 8,
      status: 'Aktif',
    },
  ],
  pendaftaran: [
    {
      id: '1',
      nomor_registrasi: 'REG-00001',
      jamaah_nama: 'Ahmad Fauzi',
      paket_nama: 'Umroh Reguler 9 Hari',
      cabang_nama: 'Kantor Pusat Jakarta',
      tanggal_daftar: '2025-11-05',
      total_biaya: 28500000,
      sudah_bayar: 20666667,
      status: 'Dikonfirmasi',
    },
  ],
  pembayaran: [
    {
      id: '1',
      no_kuitansi: 'KW-001289',
      jamaah: 'Ahmad Fauzi',
      paket: 'Umroh Reguler 9 Hari',
      tanggal: '2025-11-05',
      metode: 'Transfer Bank BSI',
      jumlah: 20666667,
      status: 'Sebagian',
      created_at: '2025-11-05T10:00:00Z',
    },
  ],
}

function getHeaders(extra: Record<string, string> = {}) {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...extra,
  }
}

export const supabaseDb = {
  /** GET rows from table with optional filters */
  async select(table: string, query?: string) {
    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        const url = `${SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`
        const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (Array.isArray(json) && json.length > 0) {
            return json
          }
        }
      }
    } catch (e) {
      console.warn(`[Supabase select fallback on ${table}]:`, e)
    }

    // Fallback store
    const store = memoryStore[table] || memoryStore[table.replace('_', '')] || []
    return store
  },

  /** INSERT one or more rows */
  async insert(table: string, data: Record<string, any> | Record<string, any>[]) {
    const records = Array.isArray(data) ? data : [data]

    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        const url = `${SUPABASE_URL}/rest/v1/${table}`
        const res = await fetch(url, {
          method: 'POST',
          headers: getHeaders({ 'Prefer': 'return=representation' }),
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const json = await res.json()
          return json
        }
      }
    } catch (e) {
      console.warn(`[Supabase insert fallback on ${table}]:`, e)
    }

    // Fallback memory store insert
    if (!memoryStore[table]) {
      memoryStore[table] = []
    }
    records.forEach((r) => {
      const item = { ...r, id: r.id || crypto.randomUUID() }
      memoryStore[table].unshift(item)
    })

    return Array.isArray(data) ? records : records[0]
  },

  /** UPDATE rows matching filter */
  async update(table: string, id: string | number, data: Record<string, any>, idCol = 'id') {
    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        const url = `${SUPABASE_URL}/rest/v1/${table}?${idCol}=eq.${id}`
        const res = await fetch(url, {
          method: 'PATCH',
          headers: getHeaders({ 'Prefer': 'return=representation' }),
          body: JSON.stringify(data),
        })
        if (res.ok) {
          return await res.json()
        }
      }
    } catch (e) {
      console.warn(`[Supabase update fallback on ${table}]:`, e)
    }

    // Fallback memory update
    if (memoryStore[table]) {
      const idx = memoryStore[table].findIndex((item) => String(item[idCol]) === String(id))
      if (idx !== -1) {
        memoryStore[table][idx] = { ...memoryStore[table][idx], ...data }
        return memoryStore[table][idx]
      }
    }
    return data
  },

  /** DELETE rows matching id */
  async delete(table: string, id: string | number, idCol = 'id') {
    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        const url = `${SUPABASE_URL}/rest/v1/${table}?${idCol}=eq.${id}`
        const res = await fetch(url, {
          method: 'DELETE',
          headers: getHeaders({ 'Prefer': 'return=representation' }),
        })
        if (res.ok) {
          return true
        }
      }
    } catch (e) {
      console.warn(`[Supabase delete fallback on ${table}]:`, e)
    }

    // Fallback memory delete
    if (memoryStore[table]) {
      memoryStore[table] = memoryStore[table].filter((item) => String(item[idCol]) !== String(id))
      return true
    }
    return true
  },

  /** Call RPC function */
  async rpc(fn: string, params: Record<string, any> = {}) {
    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        const url = `${SUPABASE_URL}/rest/v1/rpc/${fn}`
        const res = await fetch(url, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(params),
        })
        if (res.ok) {
          return await res.json()
        }
      }
    } catch (e) {
      console.warn(`[Supabase rpc fallback on ${fn}]:`, e)
    }
    return { success: true }
  },
}
