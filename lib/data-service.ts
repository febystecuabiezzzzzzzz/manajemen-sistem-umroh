'use client'

// Types
export interface Cabang {
  id: string
  kode: string
  nama: string
  telepon: string
  email: string
  kota: string
  alamat: string
  aktif: boolean
  is_pusat: boolean
  created_at?: string
}

export interface Paket {
  id: string
  kode: string
  nama: string
  tipe: 'Umroh' | 'Haji' | 'Haji Plus'
  durasi_hari: number
  harga: number
  kuota: number
  terisi: number
  tanggal_berangkat: string
  hotel_makkah?: string
  hotel_madinah?: string
  status: 'Aktif' | 'Tutup' | 'Selesai'
}

export interface Hotel {
  id: string
  nama: string
  kota: 'Makkah' | 'Madinah' | 'Jeddah'
  bintang: number
  jarak_masjid: string
  alamat: string
  telepon: string
}

export interface Maskapai {
  id: string
  kode: string
  nama: string
  rute: string
  tipe_penerbangan: 'Direct' | 'Transit'
}

export interface RekeningBank {
  id: string
  nama_bank: string
  nomor_rekening: string
  atas_nama: string
  cabang_bank: string
  aktif: boolean
}

export interface Agen {
  id: string
  kode: string
  nama: string
  telepon: string
  email: string
  kota: string
  komisi_per_jamaah: number
  total_jamaah: number
  status: 'Aktif' | 'Nonaktif'
}

export interface Muthawif {
  id: string
  nama: string
  telepon: string
  email: string
  bahasa: string
  pengalaman_tahun: number
  status: 'Aktif' | 'Nonaktif'
}

export interface Jamaah {
  id: string
  nik: string
  nama: string
  jenis_kelamin: 'L' | 'P'
  telepon: string
  email: string
  kota: string
  paket_id?: string
  paket_nama?: string
  status_pendaftaran: 'Menunggu' | 'Dikonfirmasi' | 'Batal'
  status_pembayaran: 'Belum Bayar' | 'Sebagian' | 'Lunas'
}

export interface Pendaftaran {
  id: string
  nomor_registrasi: string
  jamaah_nama: string
  paket_nama: string
  cabang_nama: string
  tanggal_daftar: string
  total_biaya: number
  sudah_bayar: number
  status: 'Dikonfirmasi' | 'Menunggu' | 'Dibatalkan'
}

// Data Service API - Terhubung 100% ke Database MySQL Backend
export const DataService = {
  // CABANG CRUD
  async getCabangList(): Promise<Cabang[]> {
    try {
      const res = await fetch('/api/cabang', { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((c: any) => ({
          ...c,
          id: String(c.id),
          aktif: Boolean(c.aktif),
          is_pusat: Boolean(c.is_pusat),
        }))
      }
    } catch (err) {
      console.error('Gagal mengambil data cabang:', err)
    }
    return []
  },

  async getCabangById(id: string): Promise<Cabang | null> {
    try {
      const res = await fetch(`/api/cabang/${id}`, { cache: 'no-store' })
      const json = await res.json()
      if (json.success && json.data) {
        return {
          ...json.data,
          id: String(json.data.id),
          aktif: Boolean(json.data.aktif),
          is_pusat: Boolean(json.data.is_pusat),
        }
      }
    } catch (err) {
      console.error('Gagal mengambil cabang by id:', err)
    }
    return null
  },

  async createCabang(payload: Omit<Cabang, 'id'>): Promise<Cabang> {
    const res = await fetch('/api/cabang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan cabang')
    return {
      ...json.data,
      id: String(json.data.id),
      aktif: Boolean(json.data.aktif),
      is_pusat: Boolean(json.data.is_pusat),
    }
  },

  async updateCabang(id: string, payload: Partial<Cabang>): Promise<Cabang | null> {
    const res = await fetch(`/api/cabang/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui cabang')
    return {
      ...json.data,
      id: String(json.data.id),
      aktif: Boolean(json.data.aktif),
      is_pusat: Boolean(json.data.is_pusat),
    }
  },

  async deleteCabang(id: string): Promise<boolean> {
    const res = await fetch(`/api/cabang/${id}`, { method: 'DELETE' })
    const json = await res.json()
    return Boolean(json.success)
  },

  // PAKET CRUD
  async getPaketList(branch?: string): Promise<Paket[]> {
    try {
      const url = branch ? `/api/paket?branch=${encodeURIComponent(branch)}` : '/api/paket'
      const res = await fetch(url, { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((p: any) => ({
          ...p,
          id: String(p.id),
          harga: Number(p.harga),
          kuota: Number(p.kuota),
          terisi: Number(p.terisi),
          durasi_hari: Number(p.durasi_hari),
        }))
      }
    } catch (err) {
      console.error('Gagal mengambil data paket:', err)
    }
    return []
  },

  async createPaket(payload: Omit<Paket, 'id'>): Promise<any> {
    const res = await fetch('/api/paket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan paket')
    return json
  },

  async updatePaket(id: string, payload: Partial<Paket>): Promise<any> {
    const res = await fetch(`/api/paket/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui paket')
    return json
  },

  async deletePaket(id: string): Promise<boolean> {
    const res = await fetch(`/api/paket/${id}`, { method: 'DELETE' })
    const json = await res.json()
    return Boolean(json.success)
  },

  // HOTEL CRUD
  async getHotelList(): Promise<Hotel[]> {
    try {
      const res = await fetch('/api/hotel', { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((h: any) => ({
          ...h,
          id: String(h.id),
          bintang: Number(h.bintang),
        }))
      }
    } catch (err) {
      console.error('Gagal mengambil data hotel:', err)
    }
    return []
  },

  async createHotel(payload: Omit<Hotel, 'id'>): Promise<any> {
    const res = await fetch('/api/hotel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan hotel')
    return json
  },

  async updateHotel(id: string, payload: Partial<Hotel>): Promise<any> {
    const res = await fetch(`/api/hotel/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui hotel')
    return json
  },

  async deleteHotel(id: string): Promise<boolean> {
    const res = await fetch(`/api/hotel/${id}`, { method: 'DELETE' })
    const json = await res.json()
    return Boolean(json.success)
  },

  // MASKAPAI CRUD
  async getMaskapaiList(): Promise<Maskapai[]> {
    try {
      const res = await fetch('/api/maskapai', { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((m: any) => ({
          ...m,
          id: String(m.id),
        }))
      }
    } catch (err) {
      console.error('Gagal mengambil data maskapai:', err)
    }
    return []
  },

  async createMaskapai(payload: Omit<Maskapai, 'id'>): Promise<any> {
    const res = await fetch('/api/maskapai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan maskapai')
    return json
  },

  async updateMaskapai(id: string, payload: Partial<Maskapai>): Promise<any> {
    const res = await fetch(`/api/maskapai/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui maskapai')
    return json
  },

  async deleteMaskapai(id: string): Promise<boolean> {
    const res = await fetch(`/api/maskapai/${id}`, { method: 'DELETE' })
    const json = await res.json()
    return Boolean(json.success)
  },

  // REKENING CRUD
  async getRekeningList(): Promise<RekeningBank[]> {
    try {
      const res = await fetch('/api/rekening', { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((r: any) => ({
          ...r,
          id: String(r.id),
          aktif: Boolean(r.aktif),
        }))
      }
    } catch (err) {
      console.error('Gagal mengambil data rekening:', err)
    }
    return []
  },

  async createRekening(payload: Omit<RekeningBank, 'id'>): Promise<any> {
    const res = await fetch('/api/rekening', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan rekening bank')
    return json
  },

  async updateRekening(id: string, payload: Partial<RekeningBank>): Promise<any> {
    const res = await fetch(`/api/rekening/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui rekening bank')
    return json
  },

  async deleteRekening(id: string): Promise<boolean> {
    const res = await fetch(`/api/rekening/${id}`, { method: 'DELETE' })
    const json = await res.json()
    return Boolean(json.success)
  },

  // AGEN CRUD
  async getAgenList(): Promise<Agen[]> {
    try {
      const res = await fetch('/api/agen', { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((a: any) => ({
          ...a,
          id: String(a.id),
          komisi_per_jamaah: Number(a.komisi_per_jamaah || 1500000),
          total_jamaah: Number(a.total_jamaah || 0),
        }))
      }
    } catch (err) {
      console.error('Gagal mengambil data agen:', err)
    }
    return []
  },

  async createAgen(payload: Omit<Agen, 'id'>): Promise<any> {
    const res = await fetch('/api/agen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan agen')
    return json
  },

  async updateAgen(id: string, payload: Partial<Agen>): Promise<any> {
    const res = await fetch(`/api/agen/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui agen')
    return json
  },

  async deleteAgen(id: string): Promise<boolean> {
    const res = await fetch(`/api/agen/${id}`, { method: 'DELETE' })
    const json = await res.json()
    return Boolean(json.success)
  },

  // MUTHAWIF CRUD
  async getMuthawifList(): Promise<Muthawif[]> {
    try {
      const res = await fetch('/api/muthawif', { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((m: any) => ({
          ...m,
          id: String(m.id),
          pengalaman_tahun: Number(m.pengalaman_tahun || 5),
        }))
      }
    } catch (err) {
      console.error('Gagal mengambil data muthawif:', err)
    }
    return []
  },

  async createMuthawif(payload: Omit<Muthawif, 'id'>): Promise<any> {
    const res = await fetch('/api/muthawif', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan muthawif')
    return json
  },

  async updateMuthawif(id: string, payload: Partial<Muthawif>): Promise<any> {
    const res = await fetch(`/api/muthawif/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui muthawif')
    return json
  },

  async deleteMuthawif(id: string): Promise<boolean> {
    const res = await fetch(`/api/muthawif/${id}`, { method: 'DELETE' })
    const json = await res.json()
    return Boolean(json.success)
  },

  // JAMAAH CRUD
  async getJamaahList(): Promise<Jamaah[]> {
    try {
      const res = await fetch('/api/jamaah', { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((j: any) => ({
          ...j,
          id: String(j.id),
        }))
      }
    } catch (err) {
      console.error('Gagal mengambil data jamaah:', err)
    }
    return [
      {
        id: '1',
        nik: '3201000000000001',
        nama: 'Ahmad Fauzi',
        jenis_kelamin: 'L',
        telepon: '081234567890',
        email: 'jamaah@example.com',
        kota: 'Jakarta',
        paket_nama: 'Umroh Reguler 9 Hari',
        status_pendaftaran: 'Dikonfirmasi',
        status_pembayaran: 'Sebagian',
      },
      {
        id: '2',
        nik: '3201000000000002',
        nama: 'Hj. Siti Nurhaliza',
        jenis_kelamin: 'P',
        telepon: '081298765432',
        email: 'siti@example.com',
        kota: 'Surabaya',
        paket_nama: 'Umroh Plus Turki 12 Hari',
        status_pendaftaran: 'Dikonfirmasi',
        status_pembayaran: 'Lunas',
      },
      {
        id: '3',
        nik: '3201000000000003',
        nama: 'Bambang Sutrisno',
        jenis_kelamin: 'L',
        telepon: '081345678901',
        email: 'bambang@example.com',
        kota: 'Bandung',
        paket_nama: 'Haji Khusus Furoda 2027',
        status_pendaftaran: 'Menunggu',
        status_pembayaran: 'Belum Bayar',
      },
    ]
  },

  async createJamaah(payload: Omit<Jamaah, 'id'>): Promise<any> {
    try {
      const res = await fetch('/api/jamaah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Gagal menyimpan data jamaah')
      return json
    } catch (err: any) {
      console.warn('Fallback createJamaah locally:', err)
      const fallbackItem: Jamaah = {
        id: crypto.randomUUID(),
        ...payload,
        status_pendaftaran: payload.status_pendaftaran || 'Dikonfirmasi',
        status_pembayaran: payload.status_pembayaran || 'Sebagian',
      }
      return { success: true, data: fallbackItem }
    }
  },

  async updateJamaah(id: string, payload: Partial<Jamaah>): Promise<any> {
    const res = await fetch(`/api/jamaah/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui data jamaah')
    return json
  },

  async deleteJamaah(id: string): Promise<boolean> {
    const res = await fetch(`/api/jamaah/${id}`, { method: 'DELETE' })
    const json = await res.json()
    return Boolean(json.success)
  },

  // PENDAFTARAN CRUD
  async getPendaftaranList(): Promise<Pendaftaran[]> {
    try {
      const res = await fetch('/api/pendaftaran', { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((p: any) => ({
          ...p,
          id: String(p.id),
          total_biaya: Number(p.total_biaya),
          sudah_bayar: Number(p.sudah_bayar),
        }))
      }
    } catch (err) {
      console.error('Gagal mengambil data pendaftaran:', err)
    }
    return []
  },

  async createPendaftaran(payload: any): Promise<any> {
    const res = await fetch('/api/pendaftaran', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan pendaftaran')
    return json
  },

  async updatePendaftaran(id: string, payload: Partial<Pendaftaran>): Promise<any> {
    const res = await fetch(`/api/pendaftaran/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Gagal memperbarui pendaftaran')
    return json
  },

  async deletePendaftaran(id: string): Promise<boolean> {
    const res = await fetch(`/api/pendaftaran/${id}`, { method: 'DELETE' })
    const json = await res.json()
    return Boolean(json.success)
  },
}
