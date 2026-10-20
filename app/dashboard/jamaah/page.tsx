'use client'

import { StatCard } from '@/components/StatCard'
import {
  ClipboardList,
  Wallet,
  FileText,
  Calendar,
} from 'lucide-react'

const checklistDokumen = [
  { nama: 'KTP', status: 'Terverifikasi', badgeBg: '#ecfdf5', badgeColor: '#10b981' },
  { nama: 'Kartu Keluarga', status: 'Sudah Diunggah', badgeBg: '#fef3c7', badgeColor: '#d97706' },
  { nama: 'Paspor', status: 'Belum Diunggah', badgeBg: '#f1f5f9', badgeColor: '#94a3b8' },
  { nama: 'Pas Foto 4x6 (latar putih)', status: 'Terverifikasi', badgeBg: '#ecfdf5', badgeColor: '#10b981' },
  { nama: 'Buku Nikah / Akta Lahir', status: 'Terverifikasi', badgeBg: '#ecfdf5', badgeColor: '#10b981' },
  { nama: 'Sertifikat Vaksin Meningitis', status: 'Sudah Diunggah', badgeBg: '#fef3c7', badgeColor: '#d97706' },
]

export default function JamaahDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
          Dashboard Jamaah
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Selamat datang, Ahmad Fauzi
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Status Pendaftaran"
          value="Dikonfirmasi"
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          label="Progress Pembayaran"
          value="73%"
          sub="Rp 20.666.667 / Rp 28.500.000"
          icon={Wallet}
          color="emerald"
        />
        <StatCard
          label="Dokumen Terverifikasi"
          value="3 / 6"
          icon={FileText}
          color="teal"
        />
        <StatCard
          label="Hitung Mundur"
          value="59 hari"
          sub="10 Dec 2026"
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Middle Grid: Progress Pembayaran & Checklist Dokumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Progress Pembayaran */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4">
              Progress Pembayaran
            </h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 font-normal">Terbayar</span>
                <span className="text-slate-800">Rp 20.666.667</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: '73%', backgroundColor: '#0d9488' }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <span className="text-slate-500 font-normal">Sisa Tagihan</span>
                <span className="text-rose-600">Rp 7.833.333</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Umroh Reguler 9 Hari
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Umroh · 9 hari · Berangkat 10 Dec 2026
              </div>
            </div>

            <a
              href="https://id.shp.ee/gteU4cYe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#EE4D2D] to-[#FF6B35] text-white text-xs font-bold hover:opacity-95 shadow-md shadow-orange-500/20 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/></svg>
              <span>Bayar Sekarang (Shopee Payment)</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        {/* Checklist Dokumen */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <h2 className="text-sm font-bold text-slate-800 mb-3">
            Checklist Dokumen
          </h2>

          <div className="divide-y divide-slate-100">
            {checklistDokumen.map((doc, idx) => (
              <div
                key={idx}
                className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between"
              >
                <span className="text-xs text-slate-700 font-normal">
                  {doc.nama}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: doc.badgeBg,
                    color: doc.badgeColor,
                  }}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Jadwal Manasik & Pengumuman Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Jadwal Manasik */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <h2 className="text-sm font-bold text-slate-800 mb-4">
            Jadwal Manasik
          </h2>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f0fdfa] border border-[#ccfbf1] flex flex-col items-center justify-center flex-shrink-0 text-[#0d9488]">
              <span className="text-xs font-bold leading-none">15</span>
              <span className="text-[9px] font-medium uppercase leading-tight mt-0.5">
                Oct
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Manasik Umroh Reguler 9 Hari #2
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Aula Kantor Pusat Jakarta
              </div>
            </div>
          </div>
        </div>

        {/* Pengumuman Terbaru */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <h2 className="text-sm font-bold text-slate-800 mb-4">
            Pengumuman Terbaru
          </h2>

          <div className="space-y-4">
            {/* Notice 1 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#ecfdf5] text-[#10b981]">
                  Jamaah
                </span>
                <span className="text-[11px] text-slate-400">
                  04 Oct 2026
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-1">
                Pelunasan Umroh Reguler
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Mohon segera melunasi biaya paket Umroh Reguler sebelum H-30 keberangkatan.
              </div>
            </div>

            {/* Notice 2 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#faf5ff] text-[#8b5cf6]">
                  Semua Pengguna
                </span>
                <span className="text-[11px] text-slate-400">
                  03 Oct 2026
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-1">
                Jadwal Manasik Akbar
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Manasik akbar akan dilaksanakan akhir bulan ini di aula utama. Wajib hadir.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-6 pb-2 text-center text-xs text-slate-400">
        <div>Travel Umroh &amp; Haji — Sistem Manajemen Umroh &amp; Haji.</div>
        <div className="mt-1">
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://id.shp.ee/gteU4cYe"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#0d9488] hover:underline"
          >
            Toko Source Code
          </a>
        </div>
      </footer>
    </div>
  )
}
