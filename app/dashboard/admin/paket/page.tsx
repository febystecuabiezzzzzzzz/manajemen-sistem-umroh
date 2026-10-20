'use client'

import React, { useState, useEffect } from 'react'
import { Package, Loader2 } from 'lucide-react'
import { DataService, Paket } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge, BadgeColor } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'
import { currency, formatDate } from '@/lib/helpers'

export default function PaketPage() {
  const [paketList, setPaketList] = useState<Paket[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Paket | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    tipe: 'Umroh' as 'Umroh' | 'Haji' | 'Haji Plus',
    durasi_hari: 9,
    harga: 28000000,
    kuota: 45,
    terisi: 0,
    tanggal_berangkat: '2026-11-20',
    hotel_makkah: 'Pullman Zamzam',
    hotel_madinah: 'Dallah Taibah',
    status: 'Aktif' as 'Aktif' | 'Tutup' | 'Selesai',
  })

  const loadData = async () => {
    setLoading(true)
    const data = await DataService.getPaketList()
    setPaketList(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  const openAddModal = () => {
    setEditingItem(null)
    setFormData({
      kode: '',
      nama: '',
      tipe: 'Umroh',
      durasi_hari: 9,
      harga: 28000000,
      kuota: 45,
      terisi: 0,
      tanggal_berangkat: '2026-11-20',
      hotel_makkah: 'Pullman Zamzam',
      hotel_madinah: 'Dallah Taibah',
      status: 'Aktif',
    })
    setShowModal(true)
  }

  const openEditModal = (paket: Paket) => {
    setEditingItem(paket)
    setFormData({
      kode: paket.kode || '',
      nama: paket.nama,
      tipe: paket.tipe,
      durasi_hari: paket.durasi_hari,
      harga: paket.harga,
      kuota: paket.kuota,
      terisi: paket.terisi || 0,
      tanggal_berangkat: paket.tanggal_berangkat,
      hotel_makkah: paket.hotel_makkah || '',
      hotel_madinah: paket.hotel_madinah || '',
      status: paket.status,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingItem) {
        await DataService.updatePaket(editingItem.id, formData)
        showToast('Paket berhasil diperbarui!', 'success')
      } else {
        await DataService.createPaket(formData)
        showToast('Paket baru berhasil ditambahkan!', 'success')
      }
      setShowModal(false)
      loadData()
    } catch {
      showToast('Gagal menyimpan paket.', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await DataService.deletePaket(deleteId)
    showToast('Paket berhasil dihapus!', 'success')
    setDeleteId(null)
    loadData()
  }

  const filteredData = paketList.filter((p) => {
    const matchType = !typeFilter || p.tipe.toLowerCase().includes(typeFilter.toLowerCase())
    const matchStatus = !statusFilter || p.status.toLowerCase() === statusFilter.toLowerCase()
    const matchQuery =
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tipe.toLowerCase().includes(searchQuery.toLowerCase())

    return matchType && matchStatus && matchQuery
  })

  const getTypeBadgeColor = (type: string): BadgeColor => {
    if (type.toLowerCase().includes('haji')) return 'purple'
    return 'blue'
  }

  const getStatusBadgeColor = (status: string): BadgeColor => {
    if (status === 'Aktif') return 'green'
    if (status === 'Tutup') return 'amber'
    return 'gray'
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Paket' }]} />

      <PageHeader
        title="Paket"
        subtitle="Daftar paket Umroh & Haji"
        actions={
          <ActionLink onClick={openAddModal} icon={Package}>
            Tambah Paket
          </ActionLink>
        }
      />

      <Card className="mt-6" padding="p-0">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 p-4 border-b border-gray-100">
          <input
            name="q"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama / kode..."
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          />
          <select
            name="type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
          >
            <option value="">Semua Jenis</option>
            <option value="umroh">Umroh</option>
            <option value="haji">Haji</option>
            <option value="haji plus">Haji Plus</option>
          </select>
          <select
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tutup">Tutup</option>
            <option value="selesai">Selesai</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200 transition text-gray-700 cursor-pointer"
          >
            Cari
          </button>
        </form>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Memuat data paket...
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Kode / Nama
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Jenis
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Kuota
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Berangkat
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((p) => {
                  const sisaKuota = Math.max(0, p.kuota - (p.terisi || 0))
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{p.nama}</div>
                        <div className="text-xs text-gray-400">{p.kode || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={getTypeBadgeColor(p.tipe)}>{p.tipe}</Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                        {currency(p.harga)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {sisaKuota}/{p.kuota}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {p.tanggal_berangkat ? formatDate(p.tanggal_berangkat) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={getStatusBadgeColor(p.status)}>{p.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <DeleteButton onClick={() => setDeleteId(p.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filteredData.length} paket
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="Belum ada paket"
            message="Tambahkan paket Umroh atau Haji untuk mulai menerima pendaftaran."
          />
        )}
      </Card>

      {/* Modal Tambah / Edit Paket */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Paket' : 'Tambah Paket'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Paket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Paket Umroh Reguler Awal Musim"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Paket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                    placeholder="Contoh: UMR-REG-01"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Paket
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => setFormData({ ...formData, tipe: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Umroh">Umroh</option>
                    <option value="Haji">Haji</option>
                    <option value="Haji Plus">Haji Plus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga (IDR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: Number(e.target.value) })}
                    placeholder="28000000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kuota Jamaah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.kuota}
                    onChange={(e) => setFormData({ ...formData, kuota: Number(e.target.value) })}
                    placeholder="45"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Keberangkatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_berangkat}
                    onChange={(e) => setFormData({ ...formData, tanggal_berangkat: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durasi (Hari)
                  </label>
                  <input
                    type="number"
                    value={formData.durasi_hari}
                    onChange={(e) => setFormData({ ...formData, durasi_hari: Number(e.target.value) })}
                    placeholder="9"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel Mekah
                  </label>
                  <input
                    type="text"
                    value={formData.hotel_makkah}
                    onChange={(e) => setFormData({ ...formData, hotel_makkah: e.target.value })}
                    placeholder="Pullman Zamzam"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel Madinah
                  </label>
                  <input
                    type="text"
                    value={formData.hotel_madinah}
                    onChange={(e) => setFormData({ ...formData, hotel_madinah: e.target.value })}
                    placeholder="Dallah Taibah"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Paket
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tutup">Tutup</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark text-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editingItem ? 'Simpan Perubahan' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Hapus Paket"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
