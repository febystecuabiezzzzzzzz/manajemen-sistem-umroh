'use client'

import React, { useState, useEffect } from 'react'
import { ClipboardList, Loader2, Printer } from 'lucide-react'
import { DataService, Pendaftaran } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge, BadgeColor } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'
import { PilgrimCardModal, PilgrimCardData } from '@/components/PrintTemplates'
import { formatDate } from '@/lib/helpers'

export default function PendaftaranPage() {
  const [pendaftaranList, setPendaftaranList] = useState<Pendaftaran[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [packageFilter, setPackageFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Pendaftaran | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [printCard, setPrintCard] = useState<PilgrimCardData | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    nomor_registrasi: '',
    jamaah_nama: '',
    paket_nama: 'Umroh Reguler 9 Hari',
    cabang_nama: 'Kantor Pusat Jakarta',
    tanggal_daftar: new Date().toISOString().split('T')[0],
    total_biaya: 28500000,
    sudah_bayar: 10000000,
    status: 'Dikonfirmasi' as 'Dikonfirmasi' | 'Menunggu' | 'Dibatalkan',
  })

  const loadData = async () => {
    setLoading(true)
    const data = await DataService.getPendaftaranList()
    setPendaftaranList(data)
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
    const regNo = `REG-${new Date().getFullYear()}-${String(pendaftaranList.length + 1).padStart(3, '0')}`
    setFormData({
      nomor_registrasi: regNo,
      jamaah_nama: '',
      paket_nama: 'Umroh Reguler 9 Hari',
      cabang_nama: 'Kantor Pusat Jakarta',
      tanggal_daftar: new Date().toISOString().split('T')[0],
      total_biaya: 28500000,
      sudah_bayar: 10000000,
      status: 'Dikonfirmasi',
    })
    setShowModal(true)
  }

  const openEditModal = (p: Pendaftaran) => {
    setEditingItem(p)
    setFormData({
      nomor_registrasi: p.nomor_registrasi,
      jamaah_nama: p.jamaah_nama,
      paket_nama: p.paket_nama,
      cabang_nama: p.cabang_nama,
      tanggal_daftar: p.tanggal_daftar,
      total_biaya: p.total_biaya,
      sudah_bayar: p.sudah_bayar,
      status: p.status,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingItem) {
        await DataService.updatePendaftaran(editingItem.id, formData)
        showToast('Pendaftaran berhasil diperbarui!', 'success')
      } else {
        await DataService.createPendaftaran(formData)
        showToast('Pendaftaran baru berhasil dibuat!', 'success')
      }
      setShowModal(false)
      loadData()
    } catch {
      showToast('Gagal menyimpan pendaftaran.', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await DataService.deletePendaftaran(deleteId)
    showToast('Pendaftaran berhasil dihapus!', 'success')
    setDeleteId(null)
    loadData()
  }

  const filteredData = pendaftaranList.filter((p) => {
    const matchStatus = !statusFilter || p.status.toLowerCase() === statusFilter.toLowerCase()
    const matchPackage = !packageFilter || p.paket_nama.toLowerCase().includes(packageFilter.toLowerCase())
    const matchQuery =
      p.jamaah_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nomor_registrasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paket_nama.toLowerCase().includes(searchQuery.toLowerCase())

    return matchStatus && matchPackage && matchQuery
  })

  const getStatusBadgeColor = (status: string): BadgeColor => {
    if (status === 'Dikonfirmasi') return 'green'
    if (status === 'Menunggu') return 'amber'
    return 'red'
  }

  const getPaymentBadge = (p: Pendaftaran): { label: string; color: BadgeColor } => {
    if (p.sudah_bayar >= p.total_biaya) {
      return { label: 'Lunas', color: 'green' }
    }
    if (p.sudah_bayar > 0) {
      return { label: 'Sebagian', color: 'amber' }
    }
    return { label: 'Belum Bayar', color: 'red' }
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Pendaftaran' }]} />

      <PageHeader
        title="Pendaftaran"
        subtitle="Booking jamaah ke paket Umroh & Haji"
        actions={
          <ActionLink onClick={openAddModal} icon={ClipboardList}>
            Daftarkan Jamaah
          </ActionLink>
        }
      />

      <Card className="mt-6" padding="p-0">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 p-4 border-b border-gray-100">
          <input
            name="q"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari jamaah / kode..."
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          />
          <select
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
          >
            <option value="">Semua Status</option>
            <option value="dikonfirmasi">Dikonfirmasi</option>
            <option value="menunggu">Menunggu</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
          <select
            name="package"
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
          >
            <option value="">Semua Paket</option>
            <option value="reguler">Umroh Reguler</option>
            <option value="vip">Umroh VIP</option>
            <option value="ramadhan">Umroh Ramadhan</option>
            <option value="haji">Haji Khusus</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200 transition text-gray-700 cursor-pointer"
          >
            Filter
          </button>
        </form>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Memuat data pendaftaran...
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Kode
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Jamaah
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Paket
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Bayar
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Tgl Daftar
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((r) => {
                  const payBadge = getPaymentBadge(r)

                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800 font-mono text-xs">
                        {r.nomor_registrasi}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{r.jamaah_nama}</td>
                      <td className="px-4 py-3 text-gray-600">{r.paket_nama}</td>
                      <td className="px-4 py-3">
                        <Badge color={getStatusBadgeColor(r.status)}>{r.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={payBadge.color}>{payBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {formatDate(r.tanggal_daftar)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setPrintCard({
                              nama: r.jamaah_nama,
                              tipe_paket: 'Umroh',
                              no_pendaftaran: r.nomor_registrasi,
                              paket: r.paket_nama,
                              tanggal_berangkat: r.tanggal_daftar,
                              no_paspor: 'A' + r.id.slice(0, 7),
                              maskapai: 'Saudia Airlines',
                              telepon: '0812-3456-7890',
                              kontak_darurat_nama: 'Keluarga',
                              kontak_darurat_telepon: '0812-9999-8888',
                            })
                          }}
                          className="text-gray-500 hover:text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Kartu
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(r)}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <DeleteButton onClick={() => setDeleteId(r.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filteredData.length} pendaftaran
            </div>
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Belum ada pendaftaran"
            message="Daftarkan jamaah untuk memulai proses keberangkatan."
          />
        )}
      </Card>

      {/* Modal Tambah / Edit Pendaftaran */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Pendaftaran' : 'Daftarkan Jamaah'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Jamaah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jamaah_nama}
                    onChange={(e) => setFormData({ ...formData, jamaah_nama: e.target.value })}
                    placeholder="Nama jamaah"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paket Pilihan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.paket_nama}
                    onChange={(e) => setFormData({ ...formData, paket_nama: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Umroh Reguler 9 Hari">Umroh Reguler 9 Hari</option>
                    <option value="Umroh VIP Ramadhan">Umroh VIP Ramadhan</option>
                    <option value="Haji Khusus Furoda">Haji Khusus Furoda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cabang
                  </label>
                  <select
                    value={formData.cabang_nama}
                    onChange={(e) => setFormData({ ...formData, cabang_nama: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Kantor Pusat Jakarta">Kantor Pusat Jakarta</option>
                    <option value="Cabang Surabaya">Cabang Surabaya</option>
                    <option value="Cabang Bandung">Cabang Bandung</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Biaya (IDR)
                  </label>
                  <input
                    type="number"
                    value={formData.total_biaya}
                    onChange={(e) => setFormData({ ...formData, total_biaya: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Bayar Awal (IDR)
                  </label>
                  <input
                    type="number"
                    value={formData.sudah_bayar}
                    onChange={(e) => setFormData({ ...formData, sudah_bayar: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Pendaftaran
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_daftar}
                    onChange={(e) => setFormData({ ...formData, tanggal_daftar: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Pendaftaran
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Dikonfirmasi">Dikonfirmasi</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Dibatalkan">Dibatalkan</option>
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
                  {editingItem ? 'Simpan Perubahan' : 'Simpan Pendaftaran'}
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

      {printCard && (
        <PilgrimCardModal
          data={printCard}
          onClose={() => setPrintCard(null)}
        />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Hapus Pendaftaran"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
