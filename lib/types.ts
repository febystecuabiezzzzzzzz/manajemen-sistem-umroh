export type Role = 'super_admin' | 'admin' | 'agent' | 'pilgrim' | 'guide' | 'jamaah' | 'muthawif'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: Role
  phone?: string
  avatar_url?: string
  created_at: string
}

export interface Paket {
  id: string
  nama: string
  tipe: 'umrah' | 'haji'
  harga: number
  durasi_hari: number
  kuota: number
  tersedia: number
  keberangkatan: string
  maskapai: string
  hotel_makkah: string
  hotel_madinah: string
  status: 'aktif' | 'penuh' | 'ditutup'
  created_at: string
}

export interface Jamaah {
  id: string
  profile_id: string
  nik: string
  nama_lengkap: string
  tempat_lahir: string
  tanggal_lahir: string
  jenis_kelamin: 'L' | 'P'
  alamat: string
  no_hp: string
  status_pernikahan: string
  pekerjaan: string
  created_at: string
}

export interface Pendaftaran {
  id: string
  jamaah_id: string
  paket_id: string
  nomor_pendaftaran: string
  tanggal_daftar: string
  status: 'pending' | 'aktif' | 'lunas' | 'batal' | 'berangkat'
  total_biaya: number
  dp_dibayar: number
  sisa_pembayaran: number
  muthawif_id?: string
  catatan?: string
  jamaah?: Jamaah
  paket?: Paket
  created_at: string
}

export interface Pembayaran {
  id: string
  pendaftaran_id: string
  jumlah: number
  metode: 'transfer' | 'tunai' | 'cicilan'
  tanggal_bayar: string
  bukti_url?: string
  status: 'pending' | 'dikonfirmasi' | 'ditolak'
  keterangan?: string
  created_at: string
}

export interface DokumenJamaah {
  id: string
  pendaftaran_id: string
  tipe: 'ktp' | 'kk' | 'paspor' | 'foto' | 'vaksin' | 'buku_nikah' | 'lainnya'
  nama_file: string
  url: string
  status: 'pending' | 'terverifikasi' | 'ditolak'
  catatan?: string
  created_at: string
}

export interface Manasik {
  id: string
  judul: string
  deskripsi?: string
  tanggal: string
  waktu_mulai: string
  waktu_selesai: string
  lokasi: string
  muthawif_id: string
  paket_id?: string
  created_at: string
}

export interface AbsensiManasik {
  id: string
  manasik_id: string
  jamaah_id: string
  status: 'hadir' | 'izin' | 'alfa'
  catatan?: string
  created_at: string
}

export interface Pengumuman {
  id: string
  judul: string
  isi: string
  target_role: 'semua' | 'jamaah' | 'muthawif'
  tanggal_posting: string
  penting: boolean
  created_at: string
}

export interface StatCard {
  label: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: string
  color: string
}
