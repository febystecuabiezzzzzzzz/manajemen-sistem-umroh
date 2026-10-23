'use client'

import React, { useState } from 'react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { X, User } from 'lucide-react'

interface JamaahMuthawif {
  id: string
  kode: string
  nama: string
  gender: 'Laki-laki' | 'Perempuan'
  nik: string
  telepon: string
  email: string
  paspor: string
  pasporExp: string
  agen: string
  status: string
  paket?: string
}

const initialJamaahList: JamaahMuthawif[] = [
  {
    id: '1',
    kode: 'JM-0001',
    nama: 'Ahmad Fauzi',
    gender: 'Laki-laki',
    nik: '3201000000000001',
    telepon: '081200000001',
    email: 'jamaah@example.com',
    paspor: 'A1000000',
    pasporExp: 'Exp Oct 2029',
    agen: '-',
    status: 'Aktif',
    paket: 'Umroh Reguler 9 Hari',
  },
  {
    id: '2',
    kode: 'JM-0004',
    nama: 'Dewi Anggraini',
    gender: 'Laki-laki',
    nik: '3201000000000004',
    telepon: '081200000004',
    email: 'jamaah4@example.com',
    paspor: 'A1000003',
    pasporExp: 'Exp Jul 2029',
    agen: 'Hasan Basri',
    status: 'Aktif',
    paket: 'Haji Plus Eksklusif',
  },
  {
    id: '3',
    kode: 'JM-0007',
    nama: 'Gunawan Wibowo',
    gender: 'Laki-laki',
    nik: '3201000000000007',
    telepon: '081200000007',
    email: 'jamaah7@example.com',
    paspor: 'A1000006',
    pasporExp: 'Exp Oct 2029',
    agen: 'Hasan Basri',
    status: 'Aktif',
    paket: 'Umroh Plus Turki 12 Hari',
  },
  {
    id: '4',
    kode: 'JM-0010',
    nama: 'Joko Widodo',
    gender: 'Laki-laki',
    nik: '3201000000000010',
    telepon: '081200000010',
    email: 'jamaah10@example.com',
    paspor: 'A1000009',
    pasporExp: 'Exp Jul 2029',
    agen: 'Hasan Basri',
    status: 'Aktif',
    paket: 'Umroh Akhir Tahun',
  },
]

export default function MuthawifJamaahPage() {
  const [list] = useState<JamaahMuthawif[]>(initialJamaahList)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modal View Detail
  const [selectedItem, setSelectedItem] = useState<JamaahMuthawif | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filtered = list.filter((item) => {
    const q = search.toLowerCase()
    const matchQuery =
      item.nama.toLowerCase().includes(q) ||
      item.kode.toLowerCase().includes(q) ||
      item.nik.includes(q) ||
      item.paspor.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || item.status === statusFilter
    return matchQuery && matchStatus
  })

  const openViewModal = (item: JamaahMuthawif) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Jamaah' }]} baseHref="/dashboard/muthawif" />

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Jamaah</h1>
        <p className="text-xs text-slate-400 mt-0.5">Daftar jamaah umroh &amp; haji</p>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / NIK / paspor..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#0d9488] focus:bg-white transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-[#0d9488] focus:bg-white cursor-pointer transition"
        >
          <option value="all">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Selesai">Selesai</option>
        </select>

        <button
          type="button"
          onClick={() => {}}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
        >
          Cari
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">KODE / NAMA</th>
                <th className="px-4 py-3.5">GENDER</th>
                <th className="px-4 py-3.5">NIK</th>
                <th className="px-4 py-3.5">KONTAK</th>
                <th className="px-4 py-3.5">PASPOR</th>
                <th className="px-4 py-3.5">AGEN</th>
                <th className="px-5 py-3.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-xs text-slate-400">
                    Tidak ada data jamaah yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800 text-sm">{item.nama}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.kode}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                        {item.gender}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-[11px] text-slate-700">
                      {item.nik}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-[#0d9488]">{item.telepon}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-700">{item.paspor}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.pasporExp}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 font-medium">
                      {item.agen}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openViewModal(item)}
                        className="text-[#0d9488] hover:underline font-semibold cursor-pointer"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View Detail Jamaah */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">
                Detail Jamaah Bimbingan
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Kode Jamaah</span>
                  <span className="font-mono font-semibold text-slate-800 text-sm">{selectedItem.kode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Nama Lengkap</span>
                  <span className="font-semibold text-slate-800 text-sm">{selectedItem.nama}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Jenis Kelamin</span>
                  <span className="font-medium text-slate-700">{selectedItem.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">NIK</span>
                  <span className="font-mono text-slate-700">{selectedItem.nik}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Nomor Telepon</span>
                  <span className="text-slate-700">{selectedItem.telepon}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email</span>
                  <span className="text-slate-700">{selectedItem.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Nomor Paspor</span>
                  <span className="text-slate-700">{selectedItem.paspor} ({selectedItem.pasporExp})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Paket</span>
                  <span className="text-slate-700 font-medium">{selectedItem.paket || 'Umroh Reguler'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Agen Referral</span>
                  <span className="text-slate-700">{selectedItem.agen}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pembimbing (Muthawif)</span>
                  <span className="text-slate-700 font-medium">Ustadz Abdullah</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
