'use client'

import React, { useState } from 'react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { X, Check } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface ManasikSchedule {
  id: string
  tanggal: string
  judul: string
  paket: string
  pembimbing: string
  kehadiran: string
  peserta: {
    id: string
    nama: string
    status: 'Hadir' | 'Izin' | 'Tidak Hadir' | 'Belum Presensi'
  }[]
}

const initialSchedules: ManasikSchedule[] = [
  {
    id: '1',
    tanggal: '18 Oct 2026',
    judul: 'Manasik Haji Plus Eksklusif #2',
    paket: 'Haji Plus Eksklusif',
    pembimbing: 'Ustadz Abdullah',
    kehadiran: '0/0',
    peserta: [
      { id: 'p1', nama: 'Dewi Anggraini', status: 'Belum Presensi' },
    ],
  },
  {
    id: '2',
    tanggal: '15 Oct 2026',
    judul: 'Manasik Umroh Reguler 9 Hari #2',
    paket: 'Umroh Reguler 9 Hari',
    pembimbing: 'Ustadz Abdullah',
    kehadiran: '0/0',
    peserta: [
      { id: 'p2', nama: 'Ahmad Fauzi', status: 'Belum Presensi' },
    ],
  },
  {
    id: '3',
    tanggal: '18 Sep 2026',
    judul: 'Manasik Haji Plus Eksklusif #1',
    paket: 'Haji Plus Eksklusif',
    pembimbing: 'Ustadz Abdullah',
    kehadiran: '2/2',
    peserta: [
      { id: 'p3', nama: 'Dewi Anggraini', status: 'Hadir' },
      { id: 'p4', nama: 'H. Sudirman', status: 'Hadir' },
    ],
  },
  {
    id: '4',
    tanggal: '15 Sep 2026',
    judul: 'Manasik Umroh Reguler 9 Hari #1',
    paket: 'Umroh Reguler 9 Hari',
    pembimbing: 'Ustadz Abdullah',
    kehadiran: '2/3',
    peserta: [
      { id: 'p5', nama: 'Ahmad Fauzi', status: 'Hadir' },
      { id: 'p6', nama: 'Siti Aminah', status: 'Hadir' },
      { id: 'p7', nama: 'Budi Hartono', status: 'Izin' },
    ],
  },
]

export default function MuthawifManasikPage() {
  const [schedules, setSchedules] = useState<ManasikSchedule[]>(initialSchedules)
  const [selectedSchedule, setSelectedSchedule] = useState<ManasikSchedule | null>(null)
  const [showModal, setShowModal] = useState(false)
  const { showToast } = useToast()

  const openAbsensiModal = (item: ManasikSchedule) => {
    setSelectedSchedule(JSON.parse(JSON.stringify(item)))
    setShowModal(true)
  }

  const handleUpdateStatus = (pesertaId: string, status: 'Hadir' | 'Izin' | 'Tidak Hadir') => {
    if (!selectedSchedule) return
    setSelectedSchedule({
      ...selectedSchedule,
      peserta: selectedSchedule.peserta.map((p) =>
        p.id === pesertaId ? { ...p, status } : p
      ),
    })
  }

  const handleSaveAbsensi = () => {
    if (!selectedSchedule) return
    const hadirCount = selectedSchedule.peserta.filter((p) => p.status === 'Hadir').length
    const totalCount = selectedSchedule.peserta.length
    const newKehadiran = `${hadirCount}/${totalCount}`

    setSchedules((prev) =>
      prev.map((s) =>
        s.id === selectedSchedule.id
          ? { ...selectedSchedule, kehadiran: newKehadiran }
          : s
      )
    )
    showToast('Presensi kehadiran manasik berhasil disimpan!', 'success')
    setShowModal(false)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Manasik' }]} baseHref="/dashboard/muthawif" />

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Manasik</h1>
        <p className="text-xs text-slate-400 mt-0.5">Jadwal bimbingan manasik &amp; absensi jamaah</p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">TANGGAL</th>
                <th className="px-5 py-3.5">JUDUL</th>
                <th className="px-5 py-3.5">PAKET</th>
                <th className="px-5 py-3.5">PEMBIMBING</th>
                <th className="px-5 py-3.5">KEHADIRAN</th>
                <th className="px-5 py-3.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-4 font-medium text-slate-700 whitespace-nowrap">
                    {item.tanggal}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {item.judul}
                  </td>
                  <td className="px-5 py-4 text-slate-700 font-medium">
                    {item.paket}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {item.pembimbing}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {item.kehadiran}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openAbsensiModal(item)}
                      className="text-[#0d9488] hover:underline font-semibold cursor-pointer"
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

      {/* Modal Absensi */}
      {showModal && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Presensi Kehadiran Jamaah
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedSchedule.judul} ({selectedSchedule.tanggal})
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedSchedule.peserta.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {p.nama}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Status saat ini: <strong className="text-slate-700">{p.status}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(['Hadir', 'Izin', 'Tidak Hadir'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateStatus(p.id, st)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition ${
                            p.status === st
                              ? st === 'Hadir'
                                ? 'bg-emerald-600 text-white'
                                : st === 'Izin'
                                ? 'bg-amber-500 text-white'
                                : 'bg-rose-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveAbsensi}
                  className="px-4 py-2 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Presensi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
