'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, CheckSquare, Calendar, Check, X, Clock } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface AbsensiItem {
  id: string
  nama: string
  sesi1: 'Hadir' | 'Tidak Hadir' | 'Izin'
  sesi2: 'Hadir' | 'Tidak Hadir' | 'Izin'
}

const initialAbsensi: AbsensiItem[] = [
  { id: '1', nama: 'Ahmad Fauzi', sesi1: 'Hadir', sesi2: 'Hadir' },
  { id: '2', nama: 'Siti Aminah', sesi1: 'Hadir', sesi2: 'Hadir' },
  { id: '3', nama: 'Budi Hartono', sesi1: 'Izin', sesi2: 'Hadir' },
  { id: '4', nama: 'Dewi Lestari', sesi1: 'Hadir', sesi2: 'Hadir' },
]

export default function MuthawifManasikPage() {
  const [list, setList] = useState<AbsensiItem[]>(initialAbsensi)
  const { showToast } = useToast()

  const setStatus = (id: string, sesi: 'sesi1' | 'sesi2', status: 'Hadir' | 'Tidak Hadir' | 'Izin') => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [sesi]: status } : item))
    )
    showToast('Presensi kehadiran jamaah berhasil diperbarui!', 'success')
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/muthawif" className="hover:text-slate-600">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Manasik & Absensi</span>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Presensi Kehadiran Manasik</h1>
        <p className="text-xs text-slate-400 mt-0.5">Catat kehadiran jamaah pada setiap sesi manasik ibadah Umroh & Haji</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">NAMA JAMAAH</th>
              <th className="py-3 px-5">SESI 1 (01 OCT)</th>
              <th className="py-3 px-5">SESI 2 (15 OCT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-bold text-slate-800">{item.nama}</td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-1.5">
                    {(['Hadir', 'Izin', 'Tidak Hadir'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(item.id, 'sesi1', st)}
                        className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                          item.sesi1 === st
                            ? st === 'Hadir'
                              ? 'bg-emerald-600 text-white'
                              : st === 'Izin'
                              ? 'bg-amber-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-1.5">
                    {(['Hadir', 'Izin', 'Tidak Hadir'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(item.id, 'sesi2', st)}
                        className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                          item.sesi2 === st
                            ? st === 'Hadir'
                              ? 'bg-emerald-600 text-white'
                              : st === 'Izin'
                              ? 'bg-amber-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
