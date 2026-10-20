'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Users,
  Check,
} from 'lucide-react'

interface ScheduleItem {
  id: string
  date: string
  title: string
  packageName: string
  guideName: string
  presentCount: number
  totalCount: number
  time: string
  location: string
  rekap: {
    hadir: number
    izin: number
    tidakHadir: number
  }
  pilgrims: {
    id: string
    name: string
    status: 'Hadir' | 'Izin' | 'Tidak Hadir'
  }[]
}

const mockSchedules: ScheduleItem[] = [
  {
    id: '1',
    date: '15 Oct 2026',
    title: 'Manasik Umroh Reguler 9 Hari #2',
    packageName: 'Umroh Reguler 9 Hari',
    guideName: 'Ustadz Abdullah',
    presentCount: 0,
    totalCount: 0,
    time: '08:30 – 12:00 WIB',
    location: 'Aula Utama Kantor Pusat Jakarta',
    rekap: {
      hadir: 0,
      izin: 0,
      tidakHadir: 0,
    },
    pilgrims: [
      { id: '1', name: 'Ahmad Fauzi', status: 'Tidak Hadir' },
      { id: '2', name: 'Hj. Siti Nurhaliza', status: 'Tidak Hadir' },
      { id: '3', name: 'Bambang Sutrisno', status: 'Tidak Hadir' },
    ],
  },
  {
    id: '2',
    date: '15 Sep 2026',
    title: 'Manasik Umroh Reguler 9 Hari #1',
    packageName: 'Umroh Reguler 9 Hari',
    guideName: 'Ustadz Abdullah',
    presentCount: 2,
    totalCount: 3,
    time: '08:30 – 12:00 WIB',
    location: 'Aula Pertemuan Lt. 2 Kantor Pusat',
    rekap: {
      hadir: 2,
      izin: 1,
      tidakHadir: 0,
    },
    pilgrims: [
      { id: '1', name: 'Ahmad Fauzi', status: 'Hadir' },
      { id: '2', name: 'Hj. Siti Nurhaliza', status: 'Hadir' },
      { id: '3', name: 'Bambang Sutrisno', status: 'Izin' },
    ],
  },
]

export default function JamaahManasikPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null)

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumb matching Laravel Blade */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/dashboard/jamaah" className="hover:text-gray-600 transition-colors">
          Beranda
        </Link>
        <ChevronRight size={13} className="text-gray-300" />
        <span className="text-gray-600 font-medium">Manasik</span>
      </div>

      {/* Page Header matching Laravel Blade */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">Manasik</h1>
        <p className="text-xs text-gray-500 mt-0.5">Jadwal bimbingan manasik &amp; absensi jamaah</p>
      </div>

      {/* Main Table Card matching Laravel <x-card class="mt-6" padding="p-0"> */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold text-gray-500">TANGGAL</th>
                <th className="py-3 px-4 font-semibold text-gray-500">JUDUL</th>
                <th className="py-3 px-4 font-semibold text-gray-500">PAKET</th>
                <th className="py-3 px-4 font-semibold text-gray-500">PEMBIMBING</th>
                <th className="py-3 px-4 font-semibold text-gray-500">KEHADIRAN</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockSchedules.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3.5 text-gray-700 text-sm">{s.date}</td>
                  <td className="px-4 py-3.5 font-medium text-gray-800 text-sm">{s.title}</td>
                  <td className="px-4 py-3.5 text-sm">
                    <span className="text-[#0d9488] hover:underline cursor-pointer font-normal">
                      {s.packageName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 text-sm">{s.guideName}</td>
                  <td className="px-4 py-3.5 text-gray-700 text-sm">
                    {s.presentCount} / {s.totalCount}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedSchedule(s)}
                      className="text-[#0d9488] font-normal text-sm hover:underline cursor-pointer"
                    >
                      Absensi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Absensi Modal matching Laravel manasik/show.blade.php */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedSchedule(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header info */}
            <div className="border-b pb-4 border-slate-100 mb-6">
              <h2 className="text-xl font-bold text-slate-900">{selectedSchedule.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{selectedSchedule.date}</p>
            </div>

            {/* 3 Stats Cards matching Laravel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-600 font-medium">Hadir</span>
                  <p className="text-xl font-bold text-emerald-900 mt-0.5">{selectedSchedule.rekap.hadir}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center">
                  <Check size={16} className="stroke-[2.5]" />
                </div>
              </div>

              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-600 font-medium">Izin</span>
                  <p className="text-xl font-bold text-amber-900 mt-0.5">{selectedSchedule.rekap.izin}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 grid place-items-center">
                  <User size={16} />
                </div>
              </div>

              <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-600 font-medium">Tidak Hadir</span>
                  <p className="text-xl font-bold text-rose-900 mt-0.5">{selectedSchedule.rekap.tidakHadir}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 grid place-items-center">
                  <Users size={16} />
                </div>
              </div>
            </div>

            {/* Informasi Jadwal Card */}
            <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/40 mb-6 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Informasi Jadwal
              </h4>
              <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500">Paket:</span>
                <span className="font-semibold text-slate-800">{selectedSchedule.packageName}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500">Pembimbing:</span>
                <span className="font-semibold text-slate-800">{selectedSchedule.guideName}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500">Waktu:</span>
                <span className="font-semibold text-slate-800">{selectedSchedule.time}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-500">Lokasi:</span>
                <span className="font-semibold text-slate-800">{selectedSchedule.location}</span>
              </div>
            </div>

            {/* Absensi Jamaah Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <div className="p-3.5 bg-slate-50/70 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Absensi Jamaah
                </h4>
              </div>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-semibold">
                    <th className="py-2.5 px-4">Jamaah</th>
                    <th className="py-2.5 px-4 text-right">Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedSchedule.pilgrims.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-4 font-medium text-slate-800">{p.name}</td>
                      <td className="py-2.5 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.status === 'Hadir'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.status === 'Izin'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSchedule(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
