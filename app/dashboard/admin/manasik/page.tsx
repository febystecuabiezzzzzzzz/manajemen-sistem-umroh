'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Plus, Calendar, MapPin, Users, X, Check, Clock, UserCheck } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface SesiManasik {
  id: string
  judul: string
  paket: string
  tanggal: string
  waktu: string
  lokasi: string
  muthawif: string
  kuota_hadir: number
}

interface AbsensiPilgrim {
  id: string
  nama: string
  paspor: string
  status: 'hadir' | 'izin' | 'alfa'
}

const initialManasik: SesiManasik[] = [
  { id: '1', judul: 'Manasik Umroh Reguler 9 Hari #1', paket: 'Umroh Reguler 9 Hari', tanggal: '2026-10-01', waktu: '08:30 - 12:00', lokasi: 'Aula Kantor Pusat Jakarta', muthawif: 'Ustadz Abdullah, Lc.', kuota_hadir: 6 },
  { id: '2', judul: 'Manasik Umroh Reguler 9 Hari #2', paket: 'Umroh Reguler 9 Hari', tanggal: '2026-10-15', waktu: '08:30 - 12:00', lokasi: 'Aula Kantor Pusat Jakarta', muthawif: 'Ustadz Abdullah, Lc.', kuota_hadir: 5 },
  { id: '3', judul: 'Manasik Haji Plus Eksklusif #2', paket: 'Haji Plus Eksklusif', tanggal: '2026-10-18', waktu: '09:00 - 15:00', lokasi: 'Aula Kantor Pusat Jakarta', muthawif: 'Ustadz Muhammad Rizqi, M.A.', kuota_hadir: 4 },
]

const dummyPilgrims: AbsensiPilgrim[] = [
  { id: '1', nama: 'Ahmad Fauzi', paspor: 'B1234567', status: 'hadir' },
  { id: '2', nama: 'Siti Aminah', paspor: 'B5678901', status: 'hadir' },
  { id: '3', nama: 'Budi Hartono', paspor: 'B2345678', status: 'hadir' },
  { id: '4', nama: 'Dewi Lestari', paspor: 'B6789012', status: 'izin' },
  { id: '5', nama: 'Hendra Pratama', paspor: 'B3456789', status: 'hadir' },
  { id: '6', nama: 'Rizky Fadillah', paspor: 'B4567890', status: 'hadir' },
  { id: '7', nama: 'Hj. Fatimah', paspor: 'B7890123', status: 'hadir' },
  { id: '8', nama: 'Nurhayati', paspor: 'B8901234', status: 'alfa' },
]

export default function ManasikPage() {
  const [list, setList] = useState<SesiManasik[]>(initialManasik)
  const [showModal, setShowModal] = useState(false)
  const [activeSession, setActiveSession] = useState<SesiManasik | null>(null)
  const [attendees, setAttendees] = useState<AbsensiPilgrim[]>(dummyPilgrims)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    judul: '',
    paket: 'Umroh Reguler 9 Hari',
    tanggal: '2026-11-01',
    waktu: '08:30 - 12:00',
    lokasi: 'Aula Kantor Pusat Jakarta',
    muthawif: 'Ustadz Abdullah, Lc.',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: SesiManasik = {
      id: String(Date.now()),
      ...formData,
      kuota_hadir: 0,
    }
    setList([...list, newItem])
    showToast('Jadwal manasik baru berhasil ditambahkan!', 'success')
    setShowModal(false)
  }

  const openAbsensi = (sesi: SesiManasik) => {
    setActiveSession(sesi)
  }

  const setStatus = (pilgrimId: string, status: 'hadir' | 'izin' | 'alfa') => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === pilgrimId ? { ...a, status } : a))
    )
  }

  const saveAbsensi = () => {
    if (!activeSession) return
    const hadirCount = attendees.filter((a) => a.status === 'hadir').length
    setList((prev) =>
      prev.map((s) => (s.id === activeSession.id ? { ...s, kuota_hadir: hadirCount } : s))
    )
    showToast(`Rekap absensi ${activeSession.judul} disimpan (${hadirCount} Hadir)!`, 'success')
    setActiveSession(null)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/admin" className="hover:text-slate-600">Beranda</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Manasik</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Jadwal Manasik &amp; Bimbingan</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kelola sesi bimbingan teori, praktik manasik &amp; absensi jamaah</p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d6962] transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={15} />
          <span>Tambah Jadwal Manasik</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((m) => (
          <div key={m.id} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                {m.paket}
              </span>
              <span className="text-xs font-bold text-slate-800">{m.tanggal}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-800">{m.judul}</h3>

            <div className="space-y-1.5 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span>{m.waktu}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <span>{m.lokasi}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-slate-400" />
                <span>Pembimbing: {m.muthawif}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Hadir: <strong className="text-emerald-600">{m.kuota_hadir}</strong> Jamaah</span>
              <button
                type="button"
                onClick={() => openAbsensi(m)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-[#0d9488] bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
              >
                <UserCheck size={13} />
                <span>Catat Absensi</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Absensi Kehadiran Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Absensi: {activeSession.judul}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeSession.tanggal} · {activeSession.waktu} · {activeSession.lokasi}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSession(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase">
                    <th className="py-2.5 px-3">NO</th>
                    <th className="py-2.5 px-3">NAMA JAMAAH</th>
                    <th className="py-2.5 px-3">PASPOR</th>
                    <th className="py-2.5 px-3 text-center">STATUS KEHADIRAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendees.map((a, i) => (
                    <tr key={a.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{i + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{a.nama}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{a.paspor}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setStatus(a.id, 'hadir')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              a.status === 'hadir'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Hadir
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(a.id, 'izin')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              a.status === 'izin'
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Izin
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(a.id, 'alfa')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              a.status === 'alfa'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Alfa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Hadir: <strong className="text-emerald-700">{attendees.filter((a) => a.status === 'hadir').length}</strong> | 
                Izin: <strong className="text-amber-700">{attendees.filter((a) => a.status === 'izin').length}</strong> | 
                Alfa: <strong className="text-rose-700">{attendees.filter((a) => a.status === 'alfa').length}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSession(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={saveAbsensi}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-colors shadow-xs"
                >
                  Simpan Rekap Absensi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Tambah Sesi Manasik</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Sesi *</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Manasik Akbar Sesi 1"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi</label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d6962] cursor-pointer"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
