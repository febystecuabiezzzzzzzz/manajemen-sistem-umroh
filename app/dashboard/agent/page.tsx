'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { StatCard } from '@/components/StatCard'
import {
  Users, CheckCircle2, Wallet, Clock, Megaphone
} from 'lucide-react'

const komisiBulananData = [
  { bulan: 'Nov 25', komisi: 0 },
  { bulan: 'Dec 25', komisi: 0 },
  { bulan: 'Jan 26', komisi: 0 },
  { bulan: 'Feb 26', komisi: 12375000 },
  { bulan: 'Mar 26', komisi: 0 },
  { bulan: 'Apr 26', komisi: 0 },
  { bulan: 'May 26', komisi: 2737500 },
  { bulan: 'Jun 26', komisi: 0 },
  { bulan: 'Jul 26', komisi: 0 },
  { bulan: 'Aug 26', komisi: 2325000 },
  { bulan: 'Sep 26', komisi: 0 },
  { bulan: 'Oct 26', komisi: 0 },
]

const statusBayarData = [
  { name: 'Lunas', value: 3, color: '#16a34a' },
  { name: 'Sebagian', value: 0, color: '#f59e0b' },
  { name: 'Belum Bayar', value: 0, color: '#dc2626' },
]

export default function AgentDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatYAxis = (val: number) => {
    if (val === 0) return '0'
    return val.toLocaleString('id-ID')
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
          Dashboard Agen
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ringkasan referral &amp; komisi Anda
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Jamaah Referral"
          value="3"
          icon={Users}
          color="teal"
        />
        <StatCard
          label="Total Komisi"
          value="Rp 17.437.500"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Komisi Dibayar"
          value="Rp 0"
          icon={Wallet}
          color="blue"
        />
        <StatCard
          label="Komisi Pending"
          value="Rp 17.437.500"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Chart: Komisi per Bulan */}
        <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">
              Komisi per Bulan
            </h2>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={komisiBulananData}
                  margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="bulan"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 16000000]}
                    ticks={[0, 2000000, 4000000, 6000000, 8000000, 10000000, 12000000, 14000000]}
                    tickFormatter={formatYAxis}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val: any) => [`Rp ${Number(val).toLocaleString('id-ID')}`, 'Komisi']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="komisi"
                    fill="#0d9488"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Memuat grafik...
              </div>
            )}
          </div>
        </div>

        {/* Right Chart: Status Bayar Jamaah */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold text-slate-800">
              Status Bayar Jamaah
            </h2>
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#16a34a]" /> Lunas
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#f59e0b]" /> Sebagian
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#dc2626]" /> Belum Bayar
              </span>
            </div>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBayarData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={3}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {statusBayarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val} Jamaah`, name]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Memuat grafik...</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Pengumuman Terbaru */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 mb-4">
          Pengumuman Terbaru
        </h2>

        <div className="space-y-4">
          {/* Announcement 1 */}
          <div className="pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-100 text-purple-700">
                Semua Pengguna
              </span>
              <span className="text-xs text-slate-400">
                03 Oct 2026
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Jadwal Manasik Akbar
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Manasik akbar akan dilaksanakan akhir bulan ini di aula utama. Wajib hadir.
            </p>
          </div>

          {/* Announcement 2 */}
          <div className="pb-2">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-700">
                Agen
              </span>
              <span className="text-xs text-slate-400">
                02 Oct 2026
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Target Komisi Bulanan
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Selamat kepada para agen! Mari capai target referral bulan ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
