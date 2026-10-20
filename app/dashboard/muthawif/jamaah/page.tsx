'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Users, Phone, Mail, CheckCircle2, Search } from 'lucide-react'

interface BimbinganRow {
  id: string
  nama: string
  telepon: string
  paket: string
  kehadiranManasik: string
  catatanKhusus: string
}

const initialData: BimbinganRow[] = [
  { id: '1', nama: 'Ahmad Fauzi', telepon: '0812-9988-7766', paket: 'Umroh Reguler 9 Hari', kehadiranManasik: '2/2 Sesi', catatanKhusus: 'Jamaah mandiri, kondisi fit' },
  { id: '2', nama: 'Siti Aminah', telepon: '0813-8877-6655', paket: 'Umroh Reguler 9 Hari', kehadiranManasik: '2/2 Sesi', catatanKhusus: 'Perlu pendampingan tawaf' },
  { id: '3', nama: 'Budi Hartono', telepon: '0815-7766-5544', paket: 'Umroh Plus Turki 12 Hari', kehadiranManasik: '1/2 Sesi', catatanKhusus: 'Izin pada sesi 1' },
  { id: '4', nama: 'Dewi Lestari', telepon: '0812-3344-5566', paket: 'Umroh Reguler 9 Hari', kehadiranManasik: '2/2 Sesi', catatanKhusus: 'Lengkap dan siap' },
]

export default function MuthawifJamaahPage() {
  const [list] = useState<BimbinganRow[]>(initialData)
  const [search, setSearch] = useState('')

  const filtered = list.filter((j) => j.nama.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/muthawif" className="hover:text-slate-600">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Jamaah Bimbingan</span>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Jamaah Bimbingan Saya</h1>
        <p className="text-xs text-slate-400 mt-0.5">Daftar jamaah yang berada dalam kelompok bimbingan Anda</p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama jamaah bimbingan..."
            className="w-full pl-3.5 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0f766e]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">NAMA JAMAAH</th>
              <th className="py-3 px-5">NO. TELEPON</th>
              <th className="py-3 px-5">PAKET PERJALANAN</th>
              <th className="py-3 px-5">KEHADIRAN MANASIK</th>
              <th className="py-3 px-5">CATATAN PEMBIMBING</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map((j) => (
              <tr key={j.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-bold text-slate-800">{j.nama}</td>
                <td className="py-3.5 px-5 text-slate-600">{j.telepon}</td>
                <td className="py-3.5 px-5 text-slate-600">{j.paket}</td>
                <td className="py-3.5 px-5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                    {j.kehadiranManasik}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-slate-500 italic">{j.catatanKhusus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
