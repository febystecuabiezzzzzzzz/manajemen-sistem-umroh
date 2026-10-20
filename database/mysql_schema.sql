-- ==============================================================================
-- SISTEM MANAJEMEN TRAVEL UMROH & HAJI - MYSQL SCHEMA (LARAGON / PHPMYADMIN)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `manajemen_umroh` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `manajemen_umroh`;

-- 1. TABEL PENGGUNA / USERS
CREATE TABLE IF NOT EXISTS `pengguna` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nama` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` VARCHAR(50) NOT NULL DEFAULT 'Staf Operasional',
  `cabang_id` VARCHAR(36) NULL,
  `status` ENUM('Aktif', 'Nonaktif', 'Suspended') NOT NULL DEFAULT 'Aktif',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL CABANG
CREATE TABLE IF NOT EXISTS `cabang` (
  `id` VARCHAR(36) PRIMARY KEY,
  `kode` VARCHAR(20) NOT NULL UNIQUE,
  `nama` VARCHAR(150) NOT NULL,
  `telepon` VARCHAR(30) NULL,
  `email` VARCHAR(100) NULL,
  `kota` VARCHAR(100) NULL,
  `alamat` TEXT NULL,
  `aktif` TINYINT(1) DEFAULT 1,
  `is_pusat` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL PAKET
CREATE TABLE IF NOT EXISTS `paket` (
  `id` VARCHAR(36) PRIMARY KEY,
  `kode` VARCHAR(30) NOT NULL UNIQUE,
  `nama` VARCHAR(150) NOT NULL,
  `tipe` VARCHAR(50) NOT NULL DEFAULT 'Umroh',
  `durasi_hari` INT NOT NULL DEFAULT 9,
  `harga` BIGINT NOT NULL DEFAULT 0,
  `kuota` INT NOT NULL DEFAULT 45,
  `terisi` INT NOT NULL DEFAULT 0,
  `tanggal_berangkat` DATE NOT NULL,
  `hotel_makkah` VARCHAR(150) NULL,
  `hotel_madinah` VARCHAR(150) NULL,
  `status` ENUM('Aktif', 'Tutup', 'Selesai') NOT NULL DEFAULT 'Aktif',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL HOTEL
CREATE TABLE IF NOT EXISTS `hotel` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nama` VARCHAR(150) NOT NULL,
  `kota` ENUM('Makkah', 'Madinah', 'Jeddah') NOT NULL,
  `bintang` INT NOT NULL DEFAULT 4,
  `jarak_masjid` VARCHAR(100) NULL,
  `alamat` TEXT NULL,
  `telepon` VARCHAR(50) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABEL MASKAPAI
CREATE TABLE IF NOT EXISTS `maskapai` (
  `id` VARCHAR(36) PRIMARY KEY,
  `kode` VARCHAR(20) NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `rute` VARCHAR(150) NOT NULL,
  `tipe_penerbangan` ENUM('Direct', 'Transit') NOT NULL DEFAULT 'Direct',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABEL REKENING
CREATE TABLE IF NOT EXISTS `rekening` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nama_bank` VARCHAR(100) NOT NULL,
  `nomor_rekening` VARCHAR(50) NOT NULL,
  `atas_nama` VARCHAR(100) NOT NULL,
  `cabang_bank` VARCHAR(100) NULL,
  `aktif` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABEL AGEN
CREATE TABLE IF NOT EXISTS `agen` (
  `id` VARCHAR(36) PRIMARY KEY,
  `kode` VARCHAR(30) NOT NULL UNIQUE,
  `nama` VARCHAR(100) NOT NULL,
  `telepon` VARCHAR(30) NULL,
  `email` VARCHAR(100) NULL,
  `kota` VARCHAR(100) NULL,
  `komisi_per_jamaah` BIGINT DEFAULT 1500000,
  `total_jamaah` INT DEFAULT 0,
  `status` ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TABEL MUTHAWIF
CREATE TABLE IF NOT EXISTS `muthawif` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nama` VARCHAR(100) NOT NULL,
  `telepon` VARCHAR(30) NULL,
  `email` VARCHAR(100) NULL,
  `bahasa` VARCHAR(100) DEFAULT 'Indonesia, Arab',
  `pengalaman_tahun` INT DEFAULT 5,
  `status` ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. TABEL JAMAAH
CREATE TABLE IF NOT EXISTS `jamaah` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nik` VARCHAR(30) NOT NULL UNIQUE,
  `nama` VARCHAR(100) NOT NULL,
  `jenis_kelamin` ENUM('L', 'P') NOT NULL,
  `telepon` VARCHAR(30) NULL,
  `email` VARCHAR(100) NULL,
  `kota` VARCHAR(100) NULL,
  `paket_id` VARCHAR(36) NULL,
  `paket_nama` VARCHAR(150) NULL,
  `status_pendaftaran` VARCHAR(50) DEFAULT 'Dikonfirmasi',
  `status_pembayaran` VARCHAR(50) DEFAULT 'Belum Bayar',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. TABEL PENDAFTARAN
CREATE TABLE IF NOT EXISTS `pendaftaran` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nomor_registrasi` VARCHAR(50) NOT NULL UNIQUE,
  `jamaah_nama` VARCHAR(100) NOT NULL,
  `paket_nama` VARCHAR(150) NOT NULL,
  `cabang_nama` VARCHAR(100) NULL,
  `tanggal_daftar` DATE NULL,
  `total_biaya` BIGINT NOT NULL DEFAULT 0,
  `sudah_bayar` BIGINT NOT NULL DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'Dikonfirmasi',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. TABEL PEMBAYARAN
CREATE TABLE IF NOT EXISTS `pembayaran` (
  `id` VARCHAR(36) PRIMARY KEY,
  `pendaftaran_id` VARCHAR(36) NULL,
  `no_kuitansi` VARCHAR(50) NULL,
  `jamaah` VARCHAR(100) NULL,
  `paket` VARCHAR(150) NULL,
  `jumlah` BIGINT NOT NULL,
  `metode` VARCHAR(50) NOT NULL DEFAULT 'transfer',
  `tanggal` DATE NULL,
  `bukti_url` VARCHAR(255) NULL,
  `status` VARCHAR(50) DEFAULT 'Sebagian',
  `keterangan` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. TABEL DOKUMEN
CREATE TABLE IF NOT EXISTS `dokumen` (
  `id` VARCHAR(36) PRIMARY KEY,
  `jamaah` VARCHAR(100) NOT NULL,
  `paspor` VARCHAR(50) DEFAULT 'Belum',
  `ktp` VARCHAR(50) DEFAULT 'Belum',
  `buku_nikah` VARCHAR(50) DEFAULT 'Belum',
  `vaksin` VARCHAR(50) DEFAULT 'Belum',
  `foto` VARCHAR(50) DEFAULT 'Belum',
  `visa` VARCHAR(50) DEFAULT 'Belum Diajukan',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. TABEL MANASIK
CREATE TABLE IF NOT EXISTS `manasik` (
  `id` VARCHAR(36) PRIMARY KEY,
  `judul` VARCHAR(150) NOT NULL,
  `paket` VARCHAR(150) NULL,
  `tanggal` DATE NOT NULL,
  `waktu` VARCHAR(50) NULL,
  `lokasi` VARCHAR(150) NULL,
  `muthawif` VARCHAR(100) NULL,
  `kuota_hadir` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. TABEL MANIFEST
CREATE TABLE IF NOT EXISTS `manifest` (
  `id` VARCHAR(36) PRIMARY KEY,
  `kamar` VARCHAR(50) NOT NULL,
  `tipe` VARCHAR(50) NOT NULL DEFAULT 'Quad',
  `hotel` VARCHAR(150) NOT NULL,
  `jamaah` JSON NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. TABEL PERLENGKAPAN
CREATE TABLE IF NOT EXISTS `perlengkapan` (
  `id` VARCHAR(36) PRIMARY KEY,
  `jamaah` VARCHAR(100) NOT NULL,
  `koper` TINYINT(1) DEFAULT 0,
  `kain_ihram` TINYINT(1) DEFAULT 0,
  `mukena` TINYINT(1) DEFAULT 0,
  `tas_paspor` TINYINT(1) DEFAULT 0,
  `buku_doa` TINYINT(1) DEFAULT 0,
  `seragam` TINYINT(1) DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'Belum Lengkap',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. TABEL KOMISI
CREATE TABLE IF NOT EXISTS `komisi` (
  `id` VARCHAR(36) PRIMARY KEY,
  `agen` VARCHAR(100) NOT NULL,
  `jamaah` VARCHAR(100) NOT NULL,
  `paket` VARCHAR(150) NOT NULL,
  `komisi` BIGINT NOT NULL DEFAULT 1500000,
  `tanggal` DATE NULL,
  `status` ENUM('Pending', 'Sudah Ditransfer') DEFAULT 'Pending',
  `tanggal_bayar` DATE NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. TABEL PENGUMUMAN
CREATE TABLE IF NOT EXISTS `pengumuman` (
  `id` VARCHAR(36) PRIMARY KEY,
  `judul` VARCHAR(150) NOT NULL,
  `isi` TEXT NOT NULL,
  `target_role` VARCHAR(50) DEFAULT 'semua',
  `tanggal_posting` DATE NULL,
  `penting` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. TABEL SETTINGS
CREATE TABLE IF NOT EXISTS `settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. TABEL ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_email` VARCHAR(100) NULL,
  `action` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================================================
-- INITIAL SEED DATA (MYSQL)
-- ==============================================================================

INSERT IGNORE INTO `cabang` (`id`, `kode`, `nama`, `telepon`, `email`, `kota`, `alamat`, `aktif`, `is_pusat`) VALUES
('1', 'CBG-JKT-01', 'Kantor Pusat Jakarta', '021-7654321', 'pusat@travelumroh.co.id', 'Jakarta Selatan', 'Jl. Sudirman No. 45, Jakarta Pusat', 1, 1),
('2', 'CBG-SBY-02', 'Cabang Surabaya', '031-1234567', 'surabaya@travelumroh.co.id', 'Surabaya', 'Jl. Pemuda No. 12, Surabaya', 1, 0),
('3', 'CBG-BDG-03', 'Cabang Bandung', '022-8765432', 'bandung@travelumroh.co.id', 'Bandung', 'Jl. Asia Afrika No. 88, Bandung', 1, 0);

INSERT IGNORE INTO `paket` (`id`, `kode`, `nama`, `tipe`, `durasi_hari`, `harga`, `kuota`, `terisi`, `tanggal_berangkat`, `hotel_makkah`, `hotel_madinah`, `status`) VALUES
('1', 'UMR-REG-9D', 'Umroh Reguler 9 Hari', 'Umroh', 9, 28500000, 45, 32, '2026-11-15', 'Swissôtel Al Maqam Makkah', 'Pullman Zamzam Madina', 'Aktif'),
('2', 'UMR-TRK-12D', 'Umroh Plus Turki 12 Hari', 'Umroh', 12, 36500000, 40, 40, '2026-12-01', 'Mövenpick Hotel & Residences', 'Dallah Taibah Hotel', 'Aktif'),
('3', 'HAJ-FUR-2027', 'Haji Khusus Furoda 2027', 'Haji Plus', 25, 250000000, 20, 8, '2027-05-20', 'Fairmont Makkah Clock Tower', 'The Oberoi Madina', 'Aktif');

INSERT IGNORE INTO `hotel` (`id`, `nama`, `kota`, `bintang`, `jarak_masjid`, `alamat`, `telepon`) VALUES
('1', 'Swissôtel Al Maqam Makkah', 'Makkah', 5, '50 meter (Depan Pelataran Haram)', 'Abraj Al Bait Complex, Makkah', '+966 12 571 7333'),
('2', 'Pullman Zamzam Madina', 'Madinah', 5, '100 meter (Samping Gerbang Nabawi)', 'Amr Bin Al Ghas Street, Madinah', '+966 14 821 0500'),
('3', 'Dallah Taibah Hotel', 'Madinah', 4, '150 meter', 'Al Madinah Al Munawwarah', '+966 14 829 0055');

INSERT IGNORE INTO `maskapai` (`id`, `kode`, `nama`, `rute`, `tipe_penerbangan`) VALUES
('1', 'SV', 'Saudi Arabian Airlines', 'CGK - JED / MED (Direct)', 'Direct'),
('2', 'GA', 'Garuda Indonesia', 'CGK - JED / MED (Direct)', 'Direct'),
('3', 'QR', 'Qatar Airways', 'CGK - DOH - JED', 'Transit');

INSERT IGNORE INTO `rekening` (`id`, `nama_bank`, `nomor_rekening`, `atas_nama`, `cabang_bank`, `aktif`) VALUES
('1', 'Bank Syariah Indonesia (BSI)', '7001234567', 'PT Travel Umroh Haji', 'KCP Sudirman Jakarta', 1),
('2', 'Bank Muamalat', '8009876543', 'PT Travel Umroh Haji', 'KC Thamrin Jakarta', 1);

INSERT IGNORE INTO `agen` (`id`, `kode`, `nama`, `telepon`, `email`, `kota`, `komisi_per_jamaah`, `total_jamaah`, `status`) VALUES
('1', 'AGN-001', 'Ustadz H. Abdullah Syukri', '081234567891', 'abdullah.agen@example.com', 'Jakarta Selatan', 1500000, 24, 'Aktif'),
('2', 'AGN-002', 'Hj. Fatimah (Kafilah Amanah)', '081398765432', 'fatimah@agen.com', 'Surabaya', 1500000, 18, 'Aktif');

INSERT IGNORE INTO `muthawif` (`id`, `nama`, `telepon`, `email`, `bahasa`, `pengalaman_tahun`, `status`) VALUES
('1', 'Ustadz Muhammad Faisal, Lc.', '081298765439', 'faisal.muthawif@example.com', 'Indonesia, Arab, Inggris', 8, 'Aktif'),
('2', 'Ustadz Abdullah, Lc.', '081211223344', 'abdullah@muthawif.com', 'Indonesia, Arab', 6, 'Aktif');

INSERT IGNORE INTO `jamaah` (`id`, `nik`, `nama`, `jenis_kelamin`, `telepon`, `email`, `kota`, `paket_id`, `paket_nama`, `status_pendaftaran`, `status_pembayaran`) VALUES
('1', '3201000000000001', 'Ahmad Fauzi', 'L', '081234567890', 'jamaah@example.com', 'Jakarta', '1', 'Umroh Reguler 9 Hari', 'Dikonfirmasi', 'Sebagian'),
('2', '3201000000000002', 'Hj. Siti Nurhaliza', 'P', '081298765432', 'siti@example.com', 'Surabaya', '2', 'Umroh Plus Turki 12 Hari', 'Dikonfirmasi', 'Lunas'),
('3', '3201000000000003', 'Bambang Sutrisno', 'L', '081345678901', 'bambang@example.com', 'Bandung', '3', 'Haji Khusus Furoda 2027', 'Menunggu', 'Belum Bayar');

INSERT IGNORE INTO `pendaftaran` (`id`, `nomor_registrasi`, `jamaah_nama`, `paket_nama`, `cabang_nama`, `tanggal_daftar`, `total_biaya`, `sudah_bayar`, `status`) VALUES
('1', 'REG-00001', 'Ahmad Fauzi', 'Umroh Reguler 9 Hari', 'Kantor Pusat Jakarta', '2025-11-05', 28500000, 20666667, 'Dikonfirmasi'),
('2', 'REG-00002', 'Hj. Siti Nurhaliza', 'Umroh Plus Turki 12 Hari', 'Cabang Surabaya', '2025-11-08', 36500000, 36500000, 'Dikonfirmasi'),
('3', 'REG-00003', 'Bambang Sutrisno', 'Haji Khusus Furoda 2027', 'Cabang Bandung', '2025-11-12', 250000000, 0, 'Menunggu');

INSERT IGNORE INTO `pembayaran` (`id`, `no_kuitansi`, `jamaah`, `paket`, `tanggal`, `metode`, `jumlah`, `status`) VALUES
('1', 'KW-001289', 'Ahmad Fauzi', 'Umroh Reguler 9 Hari', '2025-11-05', 'Transfer Bank BSI', 20666667, 'Sebagian'),
('2', 'KW-001290', 'Hj. Siti Nurhaliza', 'Umroh Plus Turki 12 Hari', '2025-11-08', 'Transfer Bank Mandiri', 36500000, 'Lunas');

INSERT IGNORE INTO `dokumen` (`id`, `jamaah`, `paspor`, `ktp`, `buku_nikah`, `vaksin`, `foto`, `visa`) VALUES
('1', 'Ahmad Fauzi', 'Lengkap', 'Lengkap', 'Lengkap', 'Lengkap', 'Lengkap', 'Issued'),
('2', 'Hj. Siti Nurhaliza', 'Lengkap', 'Lengkap', 'Lengkap', 'Proses', 'Lengkap', 'Dalam Proses'),
('3', 'Bambang Sutrisno', 'Proses', 'Lengkap', 'Belum', 'Belum', 'Lengkap', 'Belum Diajukan');

INSERT IGNORE INTO `pengguna` (`id`, `nama`, `email`, `role`, `status`) VALUES
('1', 'Super Admin', 'superadmin@example.com', 'Super Admin', 'Aktif'),
('2', 'Staf Operasional Jakarta', 'staff@example.com', 'Staf Operasional', 'Aktif'),
('3', 'Budi Santoso', 'agen@example.com', 'Agen', 'Aktif'),
('4', 'Ustadz Muhammad Faisal, Lc.', 'muthawif@example.com', 'Muthawif', 'Aktif'),
('5', 'Ahmad Fauzi', 'jamaah@example.com', 'Jamaah', 'Aktif');

INSERT IGNORE INTO `settings` (`id`, `key`, `value`) VALUES
('1', 'app_name', 'Travel Umroh & Haji'),
('2', 'app_subtitle', 'Sistem Manajemen Umroh & Haji Terpadu'),
('3', 'brand_color', '#0d9488'),
('4', 'phone', '0812-3456-7890'),
('5', 'email', 'support@travelumroh.com'),
('6', 'address', 'Jl. Sudirman No. 45, Jakarta Pusat');
