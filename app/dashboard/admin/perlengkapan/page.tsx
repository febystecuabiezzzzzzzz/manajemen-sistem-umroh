'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Package, Check, Clock, Search } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface PerlengkapanRow {
  id: string
  jamaah: string
  koper: boolean
  kain_ihram: boolean
  mukena: boolean
  tas_paspor: boolean
  buku_doa: boolean
  seragam: boolean
  status: 'Lengkap' | 'Belum Lengkap'
}

const initialData: PerlengkapanRow[] = [
  { id: '1', jamaah: 'Ahmad Fauzi', koper: true, kain_ihram: true, mukena: false, tas_paspor: true, buku_doa: true, seragam: true, status: 'Lengkap' },
  { id: '2', jamaah: 'Siti Aminah', koper: true, kain_ihram: false, mukena: true, tas_paspor: true, buku_doa: true, seragam: true, status: 'Lengkap' },
  { id: '3', jamaah: 'Budi Hartono', koper: false, kain_ihram: false, mukena: false, tas_paspor: false, buku_doa: false, seragam: false, status: 'Belum Lengkap' },
]

export default function PerlengkapanPage() {
  const [list, setList] = useState<PerlengkapanRow[]>(initialData)
  const [search, setSearch] = useState('')
  const { showToast } = useToast()

  const toggleStatus = (id: string) => {
    setList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === 'Lengkap' ? 'Belum Lengkap' : 'Lengkap'
          return {
            ...item,
            status: newStatus,
            koper: newStatus === 'Lengkap',
            kain_ihram: newStatus === 'Lengkap',
            tas_paspor: newStatus === 'Lengkap',
            buku_doa: newStatus === 'Lengkap',
            seragam: newStatus === 'Lengkap',
          }
        }
        return item
      })
    )
    showToast('Status distribusi perlengkapan berhasil diperbarui!', 'success')
  }

  const filtered = list.filter((p) => p.jamaah.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/admin" className="hover:text-slate-600">Beranda</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Perlengkapan</span>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Distribusi Perlengkapan Jamaah</h1>
        <p className="text-xs text-slate-400 mt-0.5">Monitoring penyerahan koper, seragam batik, kain ihram, dan buku panduan</p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama jamaah..."
            className="w-full pl-3.5 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0f766e]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">JAMAAH</th>
              <th className="py-3 px-5">KOPER BESAR</th>
              <th className="py-3 px-5">KAIN IHRAM / MUKENA</th>
              <th className="py-3 px-5">TAS PASPOR</th>
              <th className="py-3 px-5">BUKU DOA</th>
              <th className="py-3 px-5">BATIK</th>
              <th className="py-3 px-5">STATUS DISTRIBUSI</th>
              <th className="py-3 px-5 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-semibold text-slate-800">{item.jamaah}</td>
                <td className="py-3.5 px-5">{item.koper ? '✓ Sudah' : '-'}</td>
                <td className="py-3.5 px-5">{item.kain_ihram || item.mukena ? '✓ Sudah' : '-'}</td>
                <td className="py-3.5 px-5">{item.tas_paspor ? '✓ Sudah' : '-'}</td>
                <td className="py-3.5 px-5">{item.buku_doa ? '✓ Sudah' : '-'}</td>
                <td className="py-3.5 px-5">{item.seragam ? '✓ Sudah' : '-'}</td>
                <td className="py-3.5 px-5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.status === 'Lengkap' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    type="button"
                    onClick={() => toggleStatus(item.id)}
                    className="text-[#0d9488] hover:text-[#0f766e] font-medium text-xs cursor-pointer"
                  >
                    Ubah Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
