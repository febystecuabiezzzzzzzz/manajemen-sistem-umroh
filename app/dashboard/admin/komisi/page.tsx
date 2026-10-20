'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Percent, Check, Clock, XCircle, Search } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { currency } from '@/lib/helpers'

interface KomisiRow {
  id: string
  agen: string
  jamaah: string
  paket: string
  dasar: number
  rate: number
  komisi: number
  tanggal: string
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
}

const initialKomisi: KomisiRow[] = [
  { id: '1', agen: 'H. Suherman (Mitra Barokah)', jamaah: 'Ahmad Fauzi', paket: 'Umroh Reguler 9 Hari', dasar: 28500000, rate: 5.26, komisi: 1500000, tanggal: '2026-10-01', status: 'paid' },
  { id: '2', agen: 'H. Suherman (Mitra Barokah)', jamaah: 'Siti Aminah', paket: 'Umroh Reguler 9 Hari', dasar: 28500000, rate: 5.26, komisi: 1500000, tanggal: '2026-10-02', status: 'paid' },
  { id: '3', agen: 'Hj. Fatimah (Kafilah Amanah)', jamaah: 'Budi Hartono', paket: 'Umroh Plus Turki 12 Hari', dasar: 38500000, rate: 5.19, komisi: 2000000, tanggal: '2026-10-05', status: 'approved' },
  { id: '4', agen: 'Hj. Fatimah (Kafilah Amanah)', jamaah: 'Dewi Lestari', paket: 'Umroh Plus Turki 12 Hari', dasar: 38500000, rate: 5.19, komisi: 2000000, tanggal: '2026-10-08', status: 'pending' },
  { id: '5', agen: 'Ustadz Ridwan', jamaah: 'Hendra Pratama', paket: 'Umroh Reguler 9 Hari', dasar: 28500000, rate: 5.26, komisi: 1500000, tanggal: '2026-10-10', status: 'pending' },
]

export default function KomisiPage() {
  const [list, setList] = useState<KomisiRow[]>(initialKomisi)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { showToast } = useToast()

  const updateStatus = (id: string, newStatus: 'pending' | 'approved' | 'paid' | 'cancelled') => {
    setList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: newStatus } : k))
    )
    const label = newStatus === 'approved' ? 'Disetujui' : newStatus === 'paid' ? 'Dibayarkan' : 'Dibatalkan'
    showToast(`Status komisi diperbarui menjadi ${label}!`, 'success')
  }

  // Summary counts and amounts
  const pendingAmt = list.filter((k) => k.status === 'pending').reduce((a, c) => a + c.komisi, 0)
  const approvedAmt = list.filter((k) => k.status === 'approved').reduce((a, c) => a + c.komisi, 0)
  const paidAmt = list.filter((k) => k.status === 'paid').reduce((a, c) => a + c.komisi, 0)
  const cancelledAmt = list.filter((k) => k.status === 'cancelled').reduce((a, c) => a + c.komisi, 0)

  const pendingCount = list.filter((k) => k.status === 'pending').length
  const approvedCount = list.filter((k) => k.status === 'approved').length
  const paidCount = list.filter((k) => k.status === 'paid').length
  const cancelledCount = list.filter((k) => k.status === 'cancelled').length

  const filtered = list.filter((k) => {
    const matchStatus = statusFilter === 'all' || k.status === statusFilter
    const matchSearch =
      k.agen.toLowerCase().includes(search.toLowerCase()) ||
      k.jamaah.toLowerCase().includes(search.toLowerCase()) ||
      k.paket.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/admin" className="hover:text-slate-600">Beranda</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Komisi Agen</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Komisi Agen Mitra</h1>
          <p className="text-xs text-slate-400 mt-0.5">Rekapitulasi, persetujuan &amp; pencairan komisi referral agen</p>
        </div>
      </div>

      {/* 4 Stats Cards matching Laravel Commissions View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600"><Clock size={16} /></span>
          </div>
          <div className="text-lg font-bold text-slate-800 mt-1">{currency(pendingAmt)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{pendingCount} komisi</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Disetujui (Approved)</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Check size={16} /></span>
          </div>
          <div className="text-lg font-bold text-slate-800 mt-1">{currency(approvedAmt)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{approvedCount} komisi</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Telah Dibayar (Paid)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Percent size={16} /></span>
          </div>
          <div className="text-lg font-bold text-slate-800 mt-1">{currency(paidAmt)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{paidCount} komisi</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Dibatalkan</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600"><XCircle size={16} /></span>
          </div>
          <div className="text-lg font-bold text-slate-800 mt-1">{currency(cancelledAmt)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{cancelledCount} komisi</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari agen, jamaah, paket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Commissions Table matching Laravel columns */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">AGEN</th>
              <th className="py-3 px-5">JAMAAH</th>
              <th className="py-3 px-5">PAKET</th>
              <th className="py-3 px-4">DASAR</th>
              <th className="py-3 px-3">RATE</th>
              <th className="py-3 px-4">KOMISI</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-5 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map((k) => (
              <tr key={k.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-semibold text-slate-800">{k.agen}</td>
                <td className="py-3.5 px-5 font-medium text-slate-700">{k.jamaah}</td>
                <td className="py-3.5 px-5 text-slate-600">{k.paket}</td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{currency(k.dasar)}</td>
                <td className="py-3.5 px-3 font-mono text-slate-600">{k.rate}%</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">{currency(k.komisi)}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    k.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700'
                      : k.status === 'approved'
                      ? 'bg-blue-50 text-blue-700'
                      : k.status === 'pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    {k.status === 'paid' ? 'Paid' : k.status === 'approved' ? 'Approved' : k.status === 'pending' ? 'Pending' : 'Cancelled'}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  {k.status === 'paid' || k.status === 'cancelled' ? (
                    <span className="text-[11px] text-slate-400">Final</span>
                  ) : (
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          updateStatus(k.id, e.target.value as any)
                          e.target.value = ''
                        }
                      }}
                      className="px-2 py-1 rounded-md border border-slate-200 text-[11px] text-slate-700 bg-white focus:outline-none focus:border-[#0f766e] cursor-pointer"
                    >
                      <option value="">Ubah status…</option>
                      {k.status === 'pending' && <option value="approved">Setujui</option>}
                      <option value="paid">Tandai Dibayar</option>
                      <option value="cancelled">Batalkan</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
