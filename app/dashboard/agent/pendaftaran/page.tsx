'use client'

import React, { useState } from 'react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Plus, X } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface RegistrationRow {
  id: string
  kode: string
  jamaah: string
  paket: string
  status: 'Dikonfirmasi' | 'Menunggu' | 'Dibatalkan'
  bayar: 'Lunas' | 'Sebagian' | 'Belum Bayar'
  tglDaftar: string
  harga: number
}

const initialRegistrations: RegistrationRow[] = [
  {
    id: '1',
    kode: 'REG-00007',
    jamaah: 'Gunawan Wibowo',
    paket: 'Umroh Plus Turki 12 Hari',
    status: 'Dikonfirmasi',
    bayar: 'Lunas',
    tglDaftar: '17 May 2026',
    harga: 36500000,
  },
  {
    id: '2',
    kode: 'REG-00004',
    jamaah: 'Dewi Anggraini',
    paket: 'Haji Plus Eksklusif',
    status: 'Dikonfirmasi',
    bayar: 'Lunas',
    tglDaftar: '11 Feb 2026',
    harga: 165000000,
  },
]

export default function AgentPendaftaranPage() {
  const [list, setList] = useState<RegistrationRow[]>(initialRegistrations)
  const [statusFilter, setStatusFilter] = useState('all')
  const [paketFilter, setPaketFilter] = useState('all')
  const { showToast } = useToast()

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail'>('create')
  const [selectedItem, setSelectedItem] = useState<RegistrationRow | null>(null)

  const [formData, setFormData] = useState({
    jamaah: '',
    paket: 'Umroh Plus Turki 12 Hari',
    status: 'Dikonfirmasi' as 'Dikonfirmasi' | 'Menunggu' | 'Dibatalkan',
    bayar: 'Lunas' as 'Lunas' | 'Sebagian' | 'Belum Bayar',
  })

  const filtered = list.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter
    const matchPaket = paketFilter === 'all' || item.paket === paketFilter
    return matchStatus && matchPaket
  })

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({
      jamaah: '',
      paket: 'Umroh Plus Turki 12 Hari',
      status: 'Dikonfirmasi',
      bayar: 'Lunas',
    })
    setShowModal(true)
  }

  const openEditModal = (item: RegistrationRow) => {
    setModalMode('edit')
    setSelectedItem(item)
    setFormData({
      jamaah: item.jamaah,
      paket: item.paket,
      status: item.status,
      bayar: item.bayar,
    })
    setShowModal(true)
  }

  const openDetailModal = (item: RegistrationRow) => {
    setModalMode('detail')
    setSelectedItem(item)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalMode === 'create') {
      const nextNum = list.length + 8
      const newItem: RegistrationRow = {
        id: String(Date.now()),
        kode: `REG-0000${nextNum}`,
        jamaah: formData.jamaah,
        paket: formData.paket,
        status: formData.status,
        bayar: formData.bayar,
        tglDaftar: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
        harga: formData.paket.includes('Haji') ? 165000000 : 36500000,
      }
      setList([newItem, ...list])
      showToast('Pendaftaran jamaah berhasil dibuat!', 'success')
    } else if (modalMode === 'edit' && selectedItem) {
      setList(
        list.map((it) =>
          it.id === selectedItem.id
            ? {
                ...it,
                jamaah: formData.jamaah,
                paket: formData.paket,
                status: formData.status,
                bayar: formData.bayar,
              }
            : it
        )
      )
      showToast('Data pendaftaran berhasil diperbarui!', 'success')
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb items={[{ label: 'Pendaftaran' }]} baseHref="/dashboard/agent" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pendaftaran</h1>
          <p className="text-xs text-slate-400 mt-0.5">Booking jamaah ke paket Umroh &amp; Haji</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Daftarkan Jamaah</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-[#0d9488] focus:bg-white cursor-pointer transition min-w-[150px]"
        >
          <option value="all">Semua Status</option>
          <option value="Dikonfirmasi">Dikonfirmasi</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>

        <select
          value={paketFilter}
          onChange={(e) => setPaketFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-[#0d9488] focus:bg-white cursor-pointer transition min-w-[180px]"
        >
          <option value="all">Semua Paket</option>
          <option value="Umroh Plus Turki 12 Hari">Umroh Plus Turki 12 Hari</option>
          <option value="Haji Plus Eksklusif">Haji Plus Eksklusif</option>
          <option value="Umroh Akhir Tahun">Umroh Akhir Tahun</option>
        </select>

        <button
          type="button"
          onClick={() => {}}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
        >
          Filter
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">KODE</th>
                <th className="px-5 py-3.5">JAMAAH</th>
                <th className="px-5 py-3.5">PAKET</th>
                <th className="px-4 py-3.5">STATUS</th>
                <th className="px-4 py-3.5">BAYAR</th>
                <th className="px-5 py-3.5">TGL DAFTAR</th>
                <th className="px-5 py-3.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-xs text-slate-400">
                    Tidak ada data pendaftaran yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 font-mono font-medium text-slate-700">
                      {item.kode}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {item.jamaah}
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium">
                      {item.paket}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
                        {item.bayar}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.tglDaftar}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-3 text-xs font-semibold">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="text-[#0d9488] hover:underline cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-[#0d9488] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail / Edit / Daftarkan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">
                {modalMode === 'create'
                  ? 'Daftarkan Jamaah Baru'
                  : modalMode === 'edit'
                  ? 'Edit Pendaftaran'
                  : 'Detail Pendaftaran'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            {modalMode === 'detail' && selectedItem ? (
              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nomor Registrasi</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedItem.kode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tanggal Daftar</span>
                    <span className="font-medium text-slate-700">{selectedItem.tglDaftar}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nama Jamaah</span>
                    <span className="font-semibold text-slate-800 text-sm">{selectedItem.jamaah}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Paket Umroh / Haji</span>
                    <span className="font-medium text-slate-700">{selectedItem.paket}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status Registrasi</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-700 mt-1">
                      {selectedItem.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status Bayar</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-700 mt-1">
                      {selectedItem.bayar}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Agen Referral</span>
                    <span className="text-slate-700">Hasan Basri</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Biaya</span>
                    <span className="font-bold text-slate-800">Rp {selectedItem.harga.toLocaleString('id-ID')}</span>
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
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Jamaah</label>
                  <input
                    type="text"
                    required
                    value={formData.jamaah}
                    onChange={(e) => setFormData({ ...formData, jamaah: e.target.value })}
                    placeholder="Contoh: Gunawan Wibowo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0d9488] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pilihan Paket</label>
                  <select
                    value={formData.paket}
                    onChange={(e) => setFormData({ ...formData, paket: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0d9488] focus:bg-white"
                  >
                    <option value="Umroh Plus Turki 12 Hari">Umroh Plus Turki 12 Hari (Rp 36.500.000)</option>
                    <option value="Haji Plus Eksklusif">Haji Plus Eksklusif (Rp 165.000.000)</option>
                    <option value="Umroh Akhir Tahun">Umroh Akhir Tahun (Rp 31.000.000)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Status Pendaftaran</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0d9488] focus:bg-white"
                    >
                      <option value="Dikonfirmasi">Dikonfirmasi</option>
                      <option value="Menunggu">Menunggu</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Status Pembayaran</label>
                    <select
                      value={formData.bayar}
                      onChange={(e) => setFormData({ ...formData, bayar: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0d9488] focus:bg-white"
                    >
                      <option value="Lunas">Lunas</option>
                      <option value="Sebagian">Sebagian</option>
                      <option value="Belum Bayar">Belum Bayar</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold shadow-xs cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
