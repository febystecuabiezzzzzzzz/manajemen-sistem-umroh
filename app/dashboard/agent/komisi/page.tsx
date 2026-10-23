'use client'

import React, { useState } from 'react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Clock, Check, Wallet, XCircle } from 'lucide-react'

interface KomisiItem {
  id: string
  agen: string
  jamaah: string
  paket: string
  dasar: number
  rate: number
  komisi: number
  status: 'Menunggu' | 'Disetujui' | 'Dibayar' | 'Dibatalkan'
}

const initialKomisi: KomisiItem[] = [
  {
    id: '1',
    agen: 'Hasan Basri',
    jamaah: 'Joko Widodo',
    paket: 'Umroh Akhir Tahun',
    dasar: 31000000,
    rate: 7.5,
    komisi: 2325000,
    status: 'Disetujui',
  },
  {
    id: '2',
    agen: 'Hasan Basri',
    jamaah: 'Gunawan Wibowo',
    paket: 'Umroh Plus Turki 12 Hari',
    dasar: 36500000,
    rate: 7.5,
    komisi: 2737500,
    status: 'Disetujui',
  },
  {
    id: '3',
    agen: 'Hasan Basri',
    jamaah: 'Dewi Anggraini',
    paket: 'Haji Plus Eksklusif',
    dasar: 165000000,
    rate: 7.5,
    komisi: 12375000,
    status: 'Disetujui',
  },
]

export default function AgentKomisiPage() {
  const [list] = useState<KomisiItem[]>(initialKomisi)
  const [statusFilter, setStatusFilter] = useState('all')

  const menungguAmt = list.filter((k) => k.status === 'Menunggu').reduce((a, b) => a + b.komisi, 0)
  const disetujuiAmt = list.filter((k) => k.status === 'Disetujui').reduce((a, b) => a + b.komisi, 0)
  const dibayarAmt = list.filter((k) => k.status === 'Dibayar').reduce((a, b) => a + b.komisi, 0)
  const dibatalkanAmt = list.filter((k) => k.status === 'Dibatalkan').reduce((a, b) => a + b.komisi, 0)

  const menungguCount = list.filter((k) => k.status === 'Menunggu').length
  const disetujuiCount = list.filter((k) => k.status === 'Disetujui').length
  const dibayarCount = list.filter((k) => k.status === 'Dibayar').length
  const dibatalkanCount = list.filter((k) => k.status === 'Dibatalkan').length

  const filtered = list.filter((k) => {
    return statusFilter === 'all' || k.status === statusFilter
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb items={[{ label: 'Komisi Agen' }]} baseHref="/dashboard/agent" />

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Komisi Agen</h1>
        <p className="text-xs text-slate-400 mt-0.5">Rekap &amp; pembayaran komisi agen</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Menunggu */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-normal">Menunggu</span>
            <span className="text-lg sm:text-xl font-bold text-slate-800 block mt-0.5">
              Rp {menungguAmt.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">{menungguCount} komisi</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
        </div>

        {/* Disetujui */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-normal">Disetujui</span>
            <span className="text-lg sm:text-xl font-bold text-slate-800 block mt-0.5">
              Rp {disetujuiAmt.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">{disetujuiCount} komisi</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Check size={20} />
          </div>
        </div>

        {/* Dibayar */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-normal">Dibayar</span>
            <span className="text-lg sm:text-xl font-bold text-slate-800 block mt-0.5">
              Rp {dibayarAmt.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">{dibayarCount} komisi</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Wallet size={20} />
          </div>
        </div>

        {/* Dibatalkan */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-normal">Dibatalkan</span>
            <span className="text-lg sm:text-xl font-bold text-slate-800 block mt-0.5">
              Rp {dibatalkanAmt.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">{dibatalkanCount} komisi</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-[#0d9488] focus:bg-white cursor-pointer transition min-w-[150px]"
        >
          <option value="all">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Dibayar">Dibayar</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>

        <button
          type="button"
          onClick={() => {}}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
        >
          Filter
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">AGEN</th>
                <th className="px-5 py-3.5">JAMAAH</th>
                <th className="px-5 py-3.5">PAKET</th>
                <th className="px-5 py-3.5">DASAR</th>
                <th className="px-4 py-3.5">RATE</th>
                <th className="px-5 py-3.5">KOMISI</th>
                <th className="px-5 py-3.5">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-xs text-slate-400">
                    Tidak ada data komisi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {item.agen}
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium">
                      {item.jamaah}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.paket}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-700">
                      Rp {item.dasar.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-600">
                      {item.rate.toFixed(2)}%
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-slate-800">
                      Rp {item.komisi.toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
