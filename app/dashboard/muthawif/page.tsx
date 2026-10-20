'use client'

import { StatCard } from '@/components/StatCard'
import {
  Users,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts'

// Rekap Kehadiran data matching screenshot
const rekapKehadiranData = [
  { name: 'Hadir', value: 80, color: '#16a34a' },
  { name: 'Tidak Hadir', value: 20, color: '#dc2626' },
]

export default function MuthawifDashboard() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
          Dashboard Muthawif
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Jamaah bimbingan & jadwal manasik Anda
        </p>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Jamaah Bimbingan"
          value="4"
          icon={Users}
          color="teal"
        />
        <StatCard
          label="Manasik Hari Ini"
          value="0"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          label="Total Kehadiran"
          value="4"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Row: Manasik Mendatang & Rekap Kehadiran */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Manasik Mendatang */}
        <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <h2 className="text-sm font-bold text-slate-800 mb-4">
            Manasik Mendatang
          </h2>

          <div className="space-y-4">
            {/* Sesi 1 */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
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

              <button
                type="button"
                className="text-xs font-medium text-[#0d9488] hover:underline cursor-pointer"
              >
                Absensi
              </button>
            </div>

            {/* Sesi 2 */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f0fdfa] border border-[#ccfbf1] flex flex-col items-center justify-center flex-shrink-0 text-[#0d9488]">
                  <span className="text-xs font-bold leading-none">18</span>
                  <span className="text-[9px] font-medium uppercase leading-tight mt-0.5">
                    Oct
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Manasik Haji Plus Eksklusif #2
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Aula Kantor Pusat Jakarta
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="text-xs font-medium text-[#0d9488] hover:underline cursor-pointer"
              >
                Absensi
              </button>
            </div>
          </div>
        </div>

        {/* Rekap Kehadiran */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800">
              Rekap Kehadiran
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#16a34a]" /> Hadir
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#dc2626]" /> Tidak Hadir
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#f59e0b]" /> Izin
              </span>
            </div>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rekapKehadiranData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={3}
                  startAngle={90}
                  endAngle={-270}
                >
                  {rekapKehadiranData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    borderColor: '#e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row: Pengumuman Terbaru */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs max-w-2xl">
        <h2 className="text-sm font-bold text-slate-800 mb-3">
          Pengumuman Terbaru
        </h2>

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

      {/* Footer */}
      <footer className="pt-8 pb-2 text-center text-xs text-slate-400">
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
