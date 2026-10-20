'use client'

import React, { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { StatCard } from '@/components/StatCard'
import {
  Users, ClipboardList, Wallet, Ban, Loader2
} from 'lucide-react'
import { useBranch } from '@/components/BranchContext'

interface DashboardData {
  stats: {
    totalJamaah: number
    pendaftaranAktif: number
    omzetDiterima: number
    outstanding: number
  }
  pendaftaranData: { bulan: string; total: number }[]
  statusPembayaran: { name: string; value: number; color: string }[]
  jamaahPerPaket: { paket: string; jamaah: number }[]
  keberangkatanTerdekat: {
    id: number
    nama: string
    info: string
    badge: string
    badgeBg: string
    badgeColor: string
  }[]
}

export default function AdminDashboard() {
  const { selectedBranch } = useBranch()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function fetchStats() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/dashboard/stats?branch=${encodeURIComponent(selectedBranch)}`)
        const json = await res.json()
        if (isMounted) {
          if (json.success) {
            setData(json)
          } else {
            setError(json.error || 'Gagal mengambil data dari database')
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Koneksi ke backend gagal')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchStats()
    return () => {
      isMounted = false
    }
  }, [selectedBranch])

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
        <span className="text-xs font-medium">Memuat data operasional dari database...</span>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        <p className="font-semibold">Terjadi Kesalahan Koneksi Database:</p>
        <p className="text-xs mt-1 text-red-600">{error}</p>
        <p className="text-xs mt-2 text-slate-500">Pastikan MySQL di Laragon telah aktif dan database `sistem_umroh_haji` dapat diakses.</p>
      </div>
    )
  }

  const stats = data?.stats || {
    totalJamaah: 0,
    pendaftaranAktif: 0,
    omzetDiterima: 0,
    outstanding: 0,
  }
  const pendaftaranData = data?.pendaftaranData || []
  const statusPembayaran = data?.statusPembayaran || []
  const jamaahPerPaket = data?.jamaahPerPaket || []
  const keberangkatanTerdekat = data?.keberangkatanTerdekat || []

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
          Dashboard Operasional
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Ringkasan {selectedBranch === 'Semua Cabang' ? 'Kantor Pusat Jakarta' : selectedBranch}
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Jamaah"
          value={stats.totalJamaah.toLocaleString('id-ID')}
          icon={Users}
          color="teal"
        />
        <StatCard
          label="Pendaftaran Aktif"
          value={stats.pendaftaranAktif.toLocaleString('id-ID')}
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          label="Omzet Diterima"
          value={`Rp ${Math.round(stats.omzetDiterima).toLocaleString('id-ID')}`}
          icon={Wallet}
          color="emerald"
        />
        <StatCard
          label="Outstanding"
          value={`Rp ${Math.round(stats.outstanding).toLocaleString('id-ID')}`}
          icon={Ban}
          color="amber"
        />
      </div>

      {/* Row 1: Area Chart (Pendaftaran 12 Bulan) + Donut (Status Pembayaran) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pendaftaran 12 Bulan Terakhir */}
        <div
          className="lg:col-span-8 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-800">
              Pendaftaran 12 Bulan Terakhir
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 sm:mt-0 self-center">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0d9488]" />
              <span className="text-[11px] text-slate-500 font-medium">Pendaftaran</span>
            </div>
          </div>

          <div className="h-64 w-full">
            {pendaftaranData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Belum ada data pendaftaran tercatat di database.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pendaftaranData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tealFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="bulan"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value} Jamaah`, 'Pendaftaran']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#0d9488"
                    strokeWidth={2}
                    fill="url(#tealFill)"
                    dot={{ fill: '#0d9488', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Pembayaran */}
        <div
          className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800">
              Status Pembayaran
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#16a34a]" /> Lunas
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#dc2626]" /> Sebagian
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#f59e0b]" /> Belum Bayar
              </span>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {statusPembayaran.reduce((sum, item) => sum + item.value, 0) === 0 ? (
              <div className="text-xs text-slate-400">Belum ada transaksi pembayaran.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPembayaran}
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
                    {statusPembayaran.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} Pendaftaran`, name]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Bar Chart (Jamaah per Paket) + Keberangkatan Terdekat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Jamaah per Paket */}
        <div
          className="lg:col-span-8 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs"
        >
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-800">
              Jamaah per Paket
            </h2>
          </div>

          <div className="h-64 w-full">
            {jamaahPerPaket.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Belum ada paket perjalanan yang terdaftar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={jamaahPerPaket}
                  margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
                  barSize={60}
                >
                  <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="paket"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value} Jamaah`, 'Total']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="jamaah"
                    fill="#0d9488"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Keberangkatan Terdekat */}
        <div
          className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs"
        >
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-800">
              Keberangkatan Terdekat
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {keberangkatanTerdekat.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Tidak ada jadwal keberangkatan terdekat.
              </div>
            ) : (
              keberangkatanTerdekat.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {item.nama}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {item.info}
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0"
                    style={{
                      backgroundColor: item.badgeBg,
                      color: item.badgeColor,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pengumuman Operasional matching Laravel staff.blade.php */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 mb-3">Pengumuman &amp; Informasi Operasional</h2>
        <div className="divide-y divide-slate-100">
          <div className="py-3 first:pt-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                Pusat
              </span>
              <span className="text-[11px] text-slate-400">14 Okt 2026</span>
            </div>
            <p className="text-xs font-bold text-slate-800">Batas Waktu Input Manifest &amp; Rooming List November</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Seluruh admin cabang wajib menyelesaikan verifikasi paspor dan pembagian kamar hotel untuk jamaah keberangkatan November selambat-lambatnya H-14.
            </p>
          </div>
          <div className="py-3 last:pb-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                Operasional
              </span>
              <span className="text-[11px] text-slate-400">10 Okt 2026</span>
            </div>
            <p className="text-xs font-bold text-slate-800">Pembagian Perlengkapan Jamaah Musim 1448H</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Koper, kain ihram/mukena, dan seragam batik siap didistribusikan ke masing-masing cabang mulai hari Senin.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-4 pb-2 text-center text-xs text-slate-400">
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
