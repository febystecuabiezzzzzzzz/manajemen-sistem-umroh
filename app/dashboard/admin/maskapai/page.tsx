'use client'

import React, { useState, useEffect } from 'react'
import { Plane, Loader2 } from 'lucide-react'
import { DataService, Maskapai } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'

export default function MaskapaiPage() {
  const [maskapaiList, setMaskapaiList] = useState<Maskapai[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Maskapai | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    transit: '',
    aktif: true,
  })

  const loadData = async () => {
    setLoading(true)
    const data = await DataService.getMaskapaiList()
    setMaskapaiList(data)
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
    setFormData({ kode: '', nama: '', transit: '', aktif: true })
    setShowModal(true)
  }

  const openEditModal = (item: Maskapai) => {
    setEditingItem(item)
    setFormData({
      kode: item.kode || '',
      nama: item.nama || '',
      transit: (item as any).transit || item.rute || '',
      aktif: (item as any).aktif !== false,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingItem) {
        await DataService.updateMaskapai(editingItem.id, {
          kode: formData.kode,
          nama: formData.nama,
          rute: formData.transit,
          tipe_penerbangan: formData.transit ? 'Transit' : 'Direct',
          aktif: formData.aktif,
        } as any)
        showToast('Maskapai berhasil diperbarui!', 'success')
      } else {
        await DataService.createMaskapai({
          kode: formData.kode,
          nama: formData.nama,
          rute: formData.transit,
          tipe_penerbangan: formData.transit ? 'Transit' : 'Direct',
          aktif: formData.aktif,
        } as any)
        showToast('Maskapai berhasil ditambahkan!', 'success')
      }
      setShowModal(false)
      loadData()
    } catch {
      showToast('Gagal menyimpan maskapai.', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await DataService.deleteMaskapai(deleteId)
    showToast('Maskapai berhasil dihapus!', 'success')
    setDeleteId(null)
    loadData()
  }

  const filteredData = maskapaiList.filter(
    (m) =>
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((m as any).transit || m.rute || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <Breadcrumb items={[{ label: 'Maskapai' }]} />

      <PageHeader
        title="Maskapai"
        subtitle="Daftar maskapai penerbangan"
        actions={
          <ActionLink onClick={openAddModal} icon={Plane}>
            Tambah Maskapai
          </ActionLink>
        }
      />

      <Card className="mt-6" padding="p-0">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 p-4 border-b border-gray-100">
          <input
            name="q"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama maskapai..."
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200 transition text-gray-700 cursor-pointer"
          >
            Cari
          </button>
        </form>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Memuat data maskapai...
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Kode
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Transit
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((airline) => {
                  const transitVal = (airline as any).transit || airline.rute || '-'
                  const isAktif = (airline as any).aktif !== false
                  return (
                    <tr key={airline.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{airline.nama}</td>
                      <td className="px-4 py-3 text-gray-600">{airline.kode || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{transitVal}</td>
                      <td className="px-4 py-3">
                        <Badge color={isAktif ? 'green' : 'gray'}>
                          {isAktif ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(airline)}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <DeleteButton onClick={() => setDeleteId(airline.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filteredData.length} maskapai
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Plane}
            title="Belum ada maskapai"
            message="Tambahkan maskapai penerbangan untuk dipakai pada paket."
          />
        )}
      </Card>

      {/* Modal Tambah / Edit Maskapai */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Maskapai' : 'Tambah Maskapai'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Maskapai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Garuda Indonesia"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode
                  </label>
                  <input
                    type="text"
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                    placeholder="Contoh: GA"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transit
                  </label>
                  <input
                    type="text"
                    value={formData.transit}
                    onChange={(e) => setFormData({ ...formData, transit: e.target.value })}
                    placeholder="Contoh: Direct atau Dubai"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-brand outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.aktif}
                    onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700 select-none cursor-pointer">
                    Aktif
                  </label>
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
        title="Hapus Maskapai"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
