'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Printer, Users, Bed, Hotel, Search, Edit2, X, Check } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { ManifestModal, ManifestData } from '@/components/PrintTemplates'

interface ManifestPilgrim {
  id: string
  nama: string
  gender: 'L' | 'P'
  paspor: string
  kamar: string
  tipe_kamar: 'Quad' | 'Triple' | 'Double'
  bus: string
  kursi: string
  mahram: string
}

const initialPilgrims: ManifestPilgrim[] = [
  { id: '1', nama: 'Ahmad Fauzi', gender: 'L', paspor: 'B1234567', kamar: '501', tipe_kamar: 'Quad', bus: 'Bus 1', kursi: '12A', mahram: 'Siti Aminah (Istri)' },
  { id: '2', nama: 'Budi Hartono', gender: 'L', paspor: 'B2345678', kamar: '501', tipe_kamar: 'Quad', bus: 'Bus 1', kursi: '12B', mahram: '-' },
  { id: '3', nama: 'Hendra Pratama', gender: 'L', paspor: 'B3456789', kamar: '501', tipe_kamar: 'Quad', bus: 'Bus 1', kursi: '14A', mahram: '-' },
  { id: '4', nama: 'Rizky Fadillah', gender: 'L', paspor: 'B4567890', kamar: '501', tipe_kamar: 'Quad', bus: 'Bus 1', kursi: '14B', mahram: '-' },
  { id: '5', nama: 'Siti Aminah', gender: 'P', paspor: 'B5678901', kamar: '502', tipe_kamar: 'Double', bus: 'Bus 1', kursi: '15A', mahram: 'Ahmad Fauzi (Suami)' },
  { id: '6', nama: 'Dewi Lestari', gender: 'P', paspor: 'B6789012', kamar: '502', tipe_kamar: 'Double', bus: 'Bus 1', kursi: '15B', mahram: '-' },
  { id: '7', nama: 'Hj. Fatimah', gender: 'P', paspor: 'B7890123', kamar: '503', tipe_kamar: 'Triple', bus: 'Bus 1', kursi: '16A', mahram: '-' },
  { id: '8', nama: 'Nurhayati', gender: 'P', paspor: 'B8901234', kamar: '503', tipe_kamar: 'Triple', bus: 'Bus 1', kursi: '16B', mahram: '-' },
]

export default function ManifestPage() {
  const [pilgrims, setPilgrims] = useState<ManifestPilgrim[]>(initialPilgrims)
  const [paket, setPaket] = useState('Umroh Reguler 9 Hari')
  const [activeTab, setActiveTab] = useState<'tabel' | 'kamar'>('tabel')
  const [search, setSearch] = useState('')
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ManifestPilgrim | null>(null)
  const { showToast } = useToast()

  const handleSaveAlokasi = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    setPilgrims((prev) =>
      prev.map((p) => (p.id === editingItem.id ? editingItem : p))
    )
    showToast(`Alokasi kamar & bus untuk ${editingItem.nama} berhasil disimpan!`, 'success')
    setEditingItem(null)
  }

  const filteredPilgrims = pilgrims.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.paspor.toLowerCase().includes(search.toLowerCase()) ||
      p.kamar.includes(search)
  )

  const printData: ManifestData = {
    paket_nama: paket,
    paket_kode: 'PKG-REG-09H',
    tipe: 'Umroh Reguler',
    tanggal_berangkat: '2026-12-10',
    durasi_hari: 9,
    maskapai: 'Saudia Airlines (SV-819)',
    hotel_makkah: 'Pullman Zamzam Makkah (Bintang 5)',
    hotel_madinah: 'Dallah Taibah Madinah (Bintang 4)',
    jamaah_list: pilgrims.map((p) => ({
      nama: p.nama,
      gender: p.gender,
      paspor: p.paspor,
      kamar: p.kamar,
      tipe_kamar: p.tipe_kamar,
      bus: p.bus,
      kursi: p.kursi,
      mahram: p.mahram,
    })),
  }

  // Group by room for Rooming Card View
  const roomGroups = pilgrims.reduce((acc, curr) => {
    const key = curr.kamar || 'Belum Ditentukan'
    if (!acc[key]) {
      acc[key] = { kamar: key, tipe: curr.tipe_kamar, jamaah: [] }
    }
    acc[key].jamaah.push(curr.nama)
    return acc
  }, {} as Record<string, { kamar: string; tipe: string; jamaah: string[] }>)

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/admin" className="hover:text-slate-600">Beranda</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Manifest & Rooming</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Manifest Jamaah &amp; Rooming</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manifest penerbangan, pembagian kamar hotel &amp; alokasi kursi bus</p>
        </div>

        <button
          type="button"
          onClick={() => setShowPrintModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-colors shadow-xs cursor-pointer"
        >
          <Printer size={15} />
          <span>Cetak Manifest PDF</span>
        </button>
      </div>

      {/* Package Filter & Tab Switch */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700">Pilih Paket:</label>
          <select
            value={paket}
            onChange={(e) => setPaket(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
          >
            <option value="Umroh Reguler 9 Hari">Umroh Reguler 9 Hari (10 Dec 2026)</option>
            <option value="Umroh Plus Turki 12 Hari">Umroh Plus Turki 12 Hari (10 Jan 2027)</option>
            <option value="Haji Khusus 2027">Haji Khusus 2027 (10 Feb 2027)</option>
          </select>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('tabel')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'tabel' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tabel Manifest
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kamar')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'kamar' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Alokasi Kamar
          </button>
        </div>
      </div>

      {activeTab === 'tabel' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari jamaah / nomor paspor / kamar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0f766e]"
              />
            </div>
            <span className="text-xs text-slate-400 ml-auto">
              Total {filteredPilgrims.length} Jamaah
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">NO</th>
                  <th className="py-3 px-5">NAMA JAMAAH</th>
                  <th className="py-3 px-3 text-center">L/P</th>
                  <th className="py-3 px-4">NO PASPOR</th>
                  <th className="py-3 px-4">KAMAR</th>
                  <th className="py-3 px-4">TIPE</th>
                  <th className="py-3 px-4">BUS</th>
                  <th className="py-3 px-4">KURSI</th>
                  <th className="py-3 px-5">MAHRAM / GRUP</th>
                  <th className="py-3 px-4 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPilgrims.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-5 font-semibold text-slate-800">{p.nama}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        p.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {p.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{p.paspor}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      Room {p.kamar}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {p.tipe_kamar}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{p.bus}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{p.kursi}</td>
                    <td className="py-3 px-5 text-slate-500">{p.mahram}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingItem({ ...p })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-[#0f766e] bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                      >
                        <Edit2 size={12} />
                        <span>Alokasi</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(roomGroups).map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Bed size={16} className="text-[#0d9488]" />
                  Room {r.kamar}
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0d9488]">
                  Tipe {r.tipe}
                </span>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Hotel size={13} className="text-slate-400" />
                <span>Pullman Zamzam Makkah</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Penghuni ({r.jamaah.length} Jamaah):
                </div>
                <ul className="space-y-1.5 text-xs">
                  {r.jamaah.map((nama, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]" />
                      <span className="font-medium">{nama}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Alokasi Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Alokasi Kamar &amp; Bus: {editingItem.nama}
              </h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAlokasi} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Kamar Hotel</label>
                <input
                  type="text"
                  required
                  placeholder="Mis. 501"
                  value={editingItem.kamar}
                  onChange={(e) => setEditingItem({ ...editingItem, kamar: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipe Kamar</label>
                <select
                  value={editingItem.tipe_kamar}
                  onChange={(e) => setEditingItem({ ...editingItem, tipe_kamar: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                >
                  <option value="Quad">Quad (4 Orang / Kamar)</option>
                  <option value="Triple">Triple (3 Orang / Kamar)</option>
                  <option value="Double">Double (2 Orang / Kamar)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alokasi Bus</label>
                  <input
                    type="text"
                    required
                    placeholder="Mis. Bus 1"
                    value={editingItem.bus}
                    onChange={(e) => setEditingItem({ ...editingItem, bus: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Kursi</label>
                  <input
                    type="text"
                    placeholder="Mis. 12A"
                    value={editingItem.kursi}
                    onChange={(e) => setEditingItem({ ...editingItem, kursi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mahram / Grup</label>
                <input
                  type="text"
                  placeholder="Mis. Ahmad Fauzi (Suami) atau Grup Keluarga"
                  value={editingItem.mahram}
                  onChange={(e) => setEditingItem({ ...editingItem, mahram: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d6962] transition-colors shadow-xs"
                >
                  Simpan Alokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manifest Printable PDF Modal */}
      {showPrintModal && (
        <ManifestModal
          data={printData}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  )
}
