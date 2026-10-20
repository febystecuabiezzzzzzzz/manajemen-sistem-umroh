-- ==============================================================================
-- SISTEM MANAJEMEN TRAVEL UMROH & HAJI - FULL DATABASE SCHEMA & SEED DATA
-- Kompatibel dengan Supabase (PostgreSQL) & Next.js Backend
-- ==============================================================================

-- 0. BERSIHKAN TABEL LAMA (Mencegah Bentrok Tipe Data UUID vs TEXT)
DROP TABLE IF EXISTS public.dokumen CASCADE;
DROP TABLE IF EXISTS public.dokumen_jamaah CASCADE;
DROP TABLE IF EXISTS public.perlengkapan CASCADE;
DROP TABLE IF EXISTS public.manifest CASCADE;
DROP TABLE IF EXISTS public.manasik CASCADE;
DROP TABLE IF EXISTS public.komisi CASCADE;
DROP TABLE IF EXISTS public.pembayaran CASCADE;
DROP TABLE IF EXISTS public.pendaftaran CASCADE;
DROP TABLE IF EXISTS public.jamaah CASCADE;
DROP TABLE IF EXISTS public.muthawif CASCADE;
DROP TABLE IF EXISTS public.agen CASCADE;
DROP TABLE IF EXISTS public.rekening CASCADE;
DROP TABLE IF EXISTS public.maskapai CASCADE;
DROP TABLE IF EXISTS public.hotel CASCADE;
DROP TABLE IF EXISTS public.paket CASCADE;
DROP TABLE IF EXISTS public.cabang CASCADE;
DROP TABLE IF EXISTS public.pengumuman CASCADE;
DROP TABLE IF EXISTS public.pengguna CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP VIEW IF EXISTS public.rekening_bank CASCADE;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Pengguna & Hak Akses Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'jamaah' CHECK (role IN ('super_admin', 'admin', 'muthawif', 'jamaah', 'agen')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PENGGUNA (User Management Internal)
CREATE TABLE public.pengguna (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    nama TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Staf Operasional',
    cabang_id TEXT,
    status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif', 'Suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL CABANG
CREATE TABLE public.cabang (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    telepon TEXT,
    email TEXT,
    kota TEXT,
    alamat TEXT,
    aktif BOOLEAN DEFAULT true,
    is_pusat BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL PAKET
CREATE TABLE public.paket (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'Umroh',
    durasi_hari INTEGER NOT NULL DEFAULT 9,
    harga BIGINT NOT NULL DEFAULT 0,
    kuota INTEGER NOT NULL DEFAULT 45,
    terisi INTEGER NOT NULL DEFAULT 0,
    tanggal_berangkat DATE NOT NULL,
    hotel_makkah TEXT,
    hotel_madinah TEXT,
    status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Tutup', 'Selesai')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL HOTEL
CREATE TABLE public.hotel (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    nama TEXT NOT NULL,
    kota TEXT NOT NULL CHECK (kota IN ('Makkah', 'Madinah', 'Jeddah')),
    bintang INTEGER NOT NULL DEFAULT 4,
    jarak_masjid TEXT,
    alamat TEXT,
    telepon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL MASKAPAI
CREATE TABLE public.maskapai (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    kode TEXT NOT NULL,
    nama TEXT NOT NULL,
    rute TEXT NOT NULL,
    tipe_penerbangan TEXT NOT NULL DEFAULT 'Direct',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL REKENING (Bank Travel)
CREATE TABLE public.rekening (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    nama_bank TEXT NOT NULL,
    nomor_rekening TEXT NOT NULL,
    atas_nama TEXT NOT NULL,
    cabang_bank TEXT,
    aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE VIEW public.rekening_bank AS SELECT * FROM public.rekening;

-- 9. TABEL AGEN
CREATE TABLE public.agen (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    telepon TEXT,
    email TEXT,
    kota TEXT,
    komisi_per_jamaah BIGINT DEFAULT 1500000,
    total_jamaah INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL MUTHAWIF (Pembimbing Ibadah)
CREATE TABLE public.muthawif (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    nama TEXT NOT NULL,
    telepon TEXT,
    email TEXT,
    bahasa TEXT DEFAULT 'Indonesia, Arab',
    pengalaman_tahun INTEGER DEFAULT 5,
    status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABEL JAMAAH
CREATE TABLE public.jamaah (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    nik TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    jenis_kelamin TEXT NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
    telepon TEXT,
    email TEXT,
    kota TEXT,
    paket_id TEXT,
    paket_nama TEXT,
    status_pendaftaran TEXT DEFAULT 'Dikonfirmasi',
    status_pembayaran TEXT DEFAULT 'Belum Bayar',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABEL PENDAFTARAN
CREATE TABLE public.pendaftaran (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    nomor_registrasi TEXT UNIQUE NOT NULL,
    jamaah_nama TEXT NOT NULL,
    paket_nama TEXT NOT NULL,
    cabang_nama TEXT,
    tanggal_daftar DATE DEFAULT CURRENT_DATE,
    total_biaya BIGINT NOT NULL DEFAULT 0,
    sudah_bayar BIGINT NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'Dikonfirmasi',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TABEL PEMBAYARAN
CREATE TABLE public.pembayaran (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    pendaftaran_id TEXT,
    no_kuitansi TEXT,
    jamaah TEXT,
    paket TEXT,
    jumlah BIGINT NOT NULL,
    metode TEXT NOT NULL DEFAULT 'transfer',
    tanggal DATE DEFAULT CURRENT_DATE,
    bukti_url TEXT,
    status TEXT DEFAULT 'Sebagian',
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TABEL DOKUMEN (Berkas Paspor, KTP, dll)
CREATE TABLE public.dokumen (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    jamaah TEXT NOT NULL,
    paspor TEXT DEFAULT 'Belum',
    ktp TEXT DEFAULT 'Belum',
    buku_nikah TEXT DEFAULT 'Belum',
    vaksin TEXT DEFAULT 'Belum',
    foto TEXT DEFAULT 'Belum',
    visa TEXT DEFAULT 'Belum Diajukan',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TABEL MANASIK (Jadwal Bimbingan Ibadah)
CREATE TABLE public.manasik (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    judul TEXT NOT NULL,
    paket TEXT,
    tanggal DATE NOT NULL,
    waktu TEXT,
    lokasi TEXT,
    muthawif TEXT,
    kuota_hadir INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. TABEL MANIFEST (Rooming List & Akomodasi Hotel)
CREATE TABLE public.manifest (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    kamar TEXT NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'Quad',
    hotel TEXT NOT NULL,
    jamaah JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. TABEL PERLENGKAPAN (Distribusi Koper & Atribut Jamaah)
CREATE TABLE public.perlengkapan (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    jamaah TEXT NOT NULL,
    koper BOOLEAN DEFAULT false,
    kain_ihram BOOLEAN DEFAULT false,
    mukena BOOLEAN DEFAULT false,
    tas_paspor BOOLEAN DEFAULT false,
    buku_doa BOOLEAN DEFAULT false,
    seragam BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'Belum Lengkap',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. TABEL KOMISI (Komisi Agen / Marketing)
CREATE TABLE public.komisi (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    agen TEXT NOT NULL,
    jamaah TEXT NOT NULL,
    paket TEXT NOT NULL,
    komisi BIGINT NOT NULL DEFAULT 1500000,
    tanggal DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Sudah Ditransfer')),
    tanggal_bayar DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. TABEL PENGUMUMAN
CREATE TABLE public.pengumuman (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    judul TEXT NOT NULL,
    isi TEXT NOT NULL,
    target_role TEXT DEFAULT 'semua',
    tanggal_posting DATE DEFAULT CURRENT_DATE,
    penting BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. TABEL SETTINGS (Pengaturan White-label & Aplikasi)
CREATE TABLE public.settings (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. TABEL ACTIVITY LOGS
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT,
    action TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paket ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maskapai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekening ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muthawif ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jamaah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendaftaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pembayaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manasik ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manifest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perlengkapan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komisi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public full access %I" ON public.%I;', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public full access %I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
    END LOOP;
END $$;

-- ==============================================================================
-- DATA AWAL (SEED DATA)
-- ==============================================================================

-- Cabang
INSERT INTO public.cabang (id, kode, nama, telepon, email, kota, alamat, aktif, is_pusat)
VALUES 
  ('1', 'CBG-JKT-01', 'Kantor Pusat Jakarta', '021-7654321', 'pusat@travelumroh.co.id', 'Jakarta Selatan', 'Jl. Sudirman No. 45, Jakarta Pusat', true, true),
  ('2', 'CBG-SBY-02', 'Cabang Surabaya', '031-1234567', 'surabaya@travelumroh.co.id', 'Surabaya', 'Jl. Pemuda No. 12, Surabaya', true, false),
  ('3', 'CBG-BDG-03', 'Cabang Bandung', '022-8765432', 'bandung@travelumroh.co.id', 'Bandung', 'Jl. Asia Afrika No. 88, Bandung', true, false);

-- Paket
INSERT INTO public.paket (id, kode, nama, tipe, durasi_hari, harga, kuota, terisi, tanggal_berangkat, hotel_makkah, hotel_madinah, status)
VALUES
  ('1', 'UMR-REG-9D', 'Umroh Reguler 9 Hari', 'Umroh', 9, 28500000, 45, 32, '2026-11-15', 'Swissôtel Al Maqam Makkah', 'Pullman Zamzam Madina', 'Aktif'),
  ('2', 'UMR-TRK-12D', 'Umroh Plus Turki 12 Hari', 'Umroh', 12, 36500000, 40, 40, '2026-12-01', 'Mövenpick Hotel & Residences', 'Dallah Taibah Hotel', 'Aktif'),
  ('3', 'HAJ-FUR-2027', 'Haji Khusus Furoda 2027', 'Haji Plus', 25, 250000000, 20, 8, '2027-05-20', 'Fairmont Makkah Clock Tower', 'The Oberoi Madina', 'Aktif');

-- Hotel
INSERT INTO public.hotel (id, nama, kota, bintang, jarak_masjid, alamat, telepon)
VALUES
  ('1', 'Swissôtel Al Maqam Makkah', 'Makkah', 5, '50 meter (Depan Pelataran Haram)', 'Abraj Al Bait Complex, Makkah', '+966 12 571 7333'),
  ('2', 'Pullman Zamzam Madina', 'Madinah', 5, '100 meter (Samping Gerbang Nabawi)', 'Amr Bin Al Ghas Street, Madinah', '+966 14 821 0500'),
  ('3', 'Dallah Taibah Hotel', 'Madinah', 4, '150 meter', 'Al Madinah Al Munawwarah', '+966 14 829 0055');

-- Maskapai
INSERT INTO public.maskapai (id, kode, nama, rute, tipe_penerbangan)
VALUES
  ('1', 'SV', 'Saudi Arabian Airlines', 'CGK - JED / MED (Direct)', 'Direct'),
  ('2', 'GA', 'Garuda Indonesia', 'CGK - JED / MED (Direct)', 'Direct'),
  ('3', 'QR', 'Qatar Airways', 'CGK - DOH - JED', 'Transit');

-- Rekening Bank
INSERT INTO public.rekening (id, nama_bank, nomor_rekening, atas_nama, cabang_bank, aktif)
VALUES
  ('1', 'Bank Syariah Indonesia (BSI)', '7001234567', 'PT Travel Umroh Haji', 'KCP Sudirman Jakarta', true),
  ('2', 'Bank Muamalat', '8009876543', 'PT Travel Umroh Haji', 'KC Thamrin Jakarta', true);

-- Agen
INSERT INTO public.agen (id, kode, nama, telepon, email, kota, komisi_per_jamaah, total_jamaah, status)
VALUES
  ('1', 'AGN-001', 'Ustadz H. Abdullah Syukri', '081234567891', 'abdullah.agen@example.com', 'Jakarta Selatan', 1500000, 24, 'Aktif'),
  ('2', 'AGN-002', 'Hj. Fatimah (Kafilah Amanah)', '081398765432', 'fatimah@agen.com', 'Surabaya', 1500000, 18, 'Aktif');

-- Muthawif
INSERT INTO public.muthawif (id, nama, telepon, email, bahasa, pengalaman_tahun, status)
VALUES
  ('1', 'Ustadz Muhammad Faisal, Lc.', '081298765439', 'faisal.muthawif@example.com', 'Indonesia, Arab, Inggris', 8, 'Aktif'),
  ('2', 'Ustadz Abdullah, Lc.', '081211223344', 'abdullah@muthawif.com', 'Indonesia, Arab', 6, 'Aktif');

-- Jamaah
INSERT INTO public.jamaah (id, nik, nama, jenis_kelamin, telepon, email, kota, paket_id, paket_nama, status_pendaftaran, status_pembayaran)
VALUES
  ('1', '3201000000000001', 'Ahmad Fauzi', 'L', '081234567890', 'jamaah@example.com', 'Jakarta', '1', 'Umroh Reguler 9 Hari', 'Dikonfirmasi', 'Sebagian'),
  ('2', '3201000000000002', 'Hj. Siti Nurhaliza', 'P', '081298765432', 'siti@example.com', 'Surabaya', '2', 'Umroh Plus Turki 12 Hari', 'Dikonfirmasi', 'Lunas'),
  ('3', '3201000000000003', 'Bambang Sutrisno', 'L', '081345678901', 'bambang@example.com', 'Bandung', '3', 'Haji Khusus Furoda 2027', 'Menunggu', 'Belum Bayar');

-- Pendaftaran
INSERT INTO public.pendaftaran (id, nomor_registrasi, jamaah_nama, paket_nama, cabang_nama, tanggal_daftar, total_biaya, sudah_bayar, status)
VALUES
  ('1', 'REG-00001', 'Ahmad Fauzi', 'Umroh Reguler 9 Hari', 'Kantor Pusat Jakarta', '2025-11-05', 28500000, 20666667, 'Dikonfirmasi'),
  ('2', 'REG-00002', 'Hj. Siti Nurhaliza', 'Umroh Plus Turki 12 Hari', 'Cabang Surabaya', '2025-11-08', 36500000, 36500000, 'Dikonfirmasi'),
  ('3', 'REG-00003', 'Bambang Sutrisno', 'Haji Khusus Furoda 2027', 'Cabang Bandung', '2025-11-12', 250000000, 0, 'Menunggu');

-- Pembayaran
INSERT INTO public.pembayaran (id, no_kuitansi, jamaah, paket, tanggal, metode, jumlah, status)
VALUES
  ('1', 'KW-001289', 'Ahmad Fauzi', 'Umroh Reguler 9 Hari', '2025-11-05', 'Transfer Bank BSI', 20666667, 'Sebagian'),
  ('2', 'KW-001290', 'Hj. Siti Nurhaliza', 'Umroh Plus Turki 12 Hari', '2025-11-08', 'Transfer Bank Mandiri', 36500000, 'Lunas');

-- Dokumen
INSERT INTO public.dokumen (id, jamaah, paspor, ktp, buku_nikah, vaksin, foto, visa)
VALUES
  ('1', 'Ahmad Fauzi', 'Lengkap', 'Lengkap', 'Lengkap', 'Lengkap', 'Lengkap', 'Issued'),
  ('2', 'Hj. Siti Nurhaliza', 'Lengkap', 'Lengkap', 'Lengkap', 'Proses', 'Lengkap', 'Dalam Proses'),
  ('3', 'Bambang Sutrisno', 'Proses', 'Lengkap', 'Belum', 'Belum', 'Lengkap', 'Belum Diajukan');

-- Manasik
INSERT INTO public.manasik (id, judul, paket, tanggal, waktu, lokasi, muthawif, kuota_hadir)
VALUES
  ('1', 'Manasik Umroh Reguler 9 Hari #1', 'Umroh Reguler 9 Hari', '2026-10-15', '08:30 - 11:30', 'Aula Kantor Pusat Jakarta', 'Ustadz Abdullah, Lc.', 28),
  ('2', 'Manasik Akbar & Praktik Tawaf / Sai', 'Semua Paket Umroh', '2026-10-25', '08:00 - 14:00', 'Asrama Haji Pondok Gede', 'KH. M. Syukron, MA', 45);

-- Manifest
INSERT INTO public.manifest (id, kamar, tipe, hotel, jamaah)
VALUES
  ('1', 'Room 501', 'Quad', 'Swissôtel Al Maqam Makkah', '["Ahmad Fauzi", "H. Sudirman", "Bambang Sutrisno", "Muhammad Ridwan"]'::jsonb),
  ('2', 'Room 502', 'Triple', 'Swissôtel Al Maqam Makkah', '["Hj. Siti Nurhaliza", "Hj. Aminah", "Dewi Lestari"]'::jsonb),
  ('3', 'Room 304', 'Double', 'Pullman Zamzam Madina', '["Ahmad Fauzi", "H. Sudirman"]'::jsonb);

-- Perlengkapan
INSERT INTO public.perlengkapan (id, jamaah, koper, kain_ihram, mukena, tas_paspor, buku_doa, seragam, status)
VALUES
  ('1', 'Ahmad Fauzi', true, true, false, true, true, true, 'Lengkap'),
  ('2', 'Hj. Siti Nurhaliza', true, false, true, true, true, true, 'Lengkap'),
  ('3', 'Bambang Sutrisno', true, true, false, false, false, false, 'Belum Lengkap');

-- Komisi
INSERT INTO public.komisi (id, agen, jamaah, paket, komisi, tanggal, status)
VALUES
  ('1', 'Ustadz H. Abdullah Syukri', 'Ahmad Fauzi', 'Umroh Reguler 9 Hari', 1500000, '2026-09-15', 'Sudah Ditransfer'),
  ('2', 'Hj. Fatimah', 'Hj. Siti Nurhaliza', 'Umroh Plus Turki 12 Hari', 2000000, '2026-10-01', 'Pending');

-- Pengguna
INSERT INTO public.pengguna (id, nama, email, role, status)
VALUES
  ('1', 'Super Admin', 'superadmin@example.com', 'Super Admin', 'Aktif'),
  ('2', 'Staf Operasional Jakarta', 'staff@example.com', 'Staf Operasional', 'Aktif'),
  ('3', 'Budi Santoso', 'agen@example.com', 'Agen', 'Aktif'),
  ('4', 'Ustadz Muhammad Faisal, Lc.', 'muthawif@example.com', 'Muthawif', 'Aktif'),
  ('5', 'Ahmad Fauzi', 'jamaah@example.com', 'Jamaah', 'Aktif');

-- Settings
INSERT INTO public.settings (key, value)
VALUES
  ('app_name', 'Travel Umroh & Haji'),
  ('app_subtitle', 'Sistem Manajemen Umroh & Haji Terpadu'),
  ('brand_color', '#0d9488'),
  ('phone', '0812-3456-7890'),
  ('email', 'support@travelumroh.com'),
  ('address', 'Jl. Sudirman No. 45, Jakarta Pusat')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
