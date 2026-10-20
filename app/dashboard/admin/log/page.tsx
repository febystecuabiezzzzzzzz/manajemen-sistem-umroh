'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Clock, ShieldCheck, Activity } from 'lucide-react'

interface AuditLog {
  id: string
  waktu: string
  user: string
  role: string
  aksi: string
  modul: string
  ip: string
}

const initialLogs: AuditLog[] = [
  { id: '1', waktu: '13 Oct 2026, 12:15', user: 'Super Admin', role: 'Super Admin', aksi: 'Menambahkan data cabang baru: Cabang Bandung', modul: 'Cabang', ip: '192.168.1.10' },
  { id: '2', waktu: '13 Oct 2026, 11:40', user: 'Super Admin', role: 'Super Admin', aksi: 'Mencatat pembayaran kuitansi KW-2026-003', modul: 'Pembayaran', ip: '192.168.1.10' },
  { id: '3', waktu: '13 Oct 2026, 10:20', user: 'Ustadz Abdullah', role: 'Muthawif', aksi: 'Memperbarui absensi manasik sesi 2', modul: 'Manasik', ip: '192.168.1.14' },
  { id: '4', waktu: '13 Oct 2026, 09:05', user: 'Ahmad Fauzi', role: 'Jamaah', aksi: 'Mengunggah scan paspor dan kartu keluarga', modul: 'Dokumen', ip: '180.252.88.1' },
]

export default function LogAktivitasPage() {
  const [logs] = useState<AuditLog[]>(initialLogs)

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/admin" className="hover:text-slate-600">Beranda</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Log Aktivitas</span>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Audit Log & Rekam Jejak Sistem</h1>
        <p className="text-xs text-slate-400 mt-0.5">Catatan seluruh riwayat aktivitas pengguna untuk transparansi dan audit keamanan</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">WAKTU</th>
              <th className="py-3 px-5">PENGGUNA</th>
              <th className="py-3 px-5">ROLE</th>
              <th className="py-3 px-5">AKTIVITAS</th>
              <th className="py-3 px-5">MODUL</th>
              <th className="py-3 px-5">IP ADDRESS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">{log.waktu}</td>
                <td className="py-3.5 px-5 font-semibold text-slate-800">{log.user}</td>
                <td className="py-3.5 px-5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                    {log.role}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-slate-700">{log.aksi}</td>
                <td className="py-3.5 px-5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                    {log.modul}
                  </span>
                </td>
                <td className="py-3.5 px-5 font-mono text-slate-500">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
