'use client'

import React, { useState, useEffect } from 'react'
import { Landmark, Loader2 } from 'lucide-react'
import { DataService, RekeningBank } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'

export default function RekeningPage() {
  const [rekeningList, setRekeningList] = useState<RekeningBank[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<RekeningBank | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    nama_bank: '',
    nomor_rekening: '',
    atas_nama: '',
    cabang_bank: 'Semua Cabang',
    aktif: true,
  })

  const loadData = async () => {
    setLoading(true)
    const data = await DataService.getRekeningList()
    setRekeningList(data)
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
      nama_bank: '',
      nomor_rekening: '',
      atas_nama: '',
      cabang_bank: 'Semua Cabang',
      aktif: true,
    })
    setShowModal(true)
  }

  const openEditModal = (item: RekeningBank) => {
    setEditingItem(item)
    setFormData({
      nama_bank: item.nama_bank,
      nomor_rekening: item.nomor_rekening,
      atas_nama: item.atas_nama,
      cabang_bank: item.cabang_bank || 'Semua Cabang',
      aktif: item.aktif !== false,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingItem) {
        await DataService.updateRekening(editingItem.id, formData)
        showToast('Rekening bank berhasil diperbarui!', 'success')
      } else {
        await DataService.createRekening(formData)
        showToast('Rekening bank berhasil ditambahkan!', 'success')
      }
      setShowModal(false)
      loadData()
    } catch {
      showToast('Gagal menyimpan rekening bank.', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await DataService.deleteRekening(deleteId)
    showToast('Rekening bank berhasil dihapus!', 'success')
    setDeleteId(null)
    loadData()
  }

  const filteredData = rekeningList.filter(
    (r) =>
      r.nama_bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.atas_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nomor_rekening.includes(searchQuery)
  )

  return (
    <div>
      <Breadcrumb items={[{ label: 'Rekening Bank' }]} />

      <PageHeader
        title="Rekening Bank"
        subtitle="Daftar rekening bank penerimaan pembayaran"
        actions={
          <ActionLink onClick={openAddModal} icon={Landmark}>
            Tambah Rekening
          </ActionLink>
        }
      />

      <Card className="mt-6" padding="p-0">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 p-4 border-b border-gray-100">
          <input
            name="q"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama bank..."
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
            Memuat data rekening...
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Bank
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    No. Rekening
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Atas Nama
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Cabang
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((account) => {
                  const isAktif = account.aktif !== false

                  return (
                    <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{account.nama_bank}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{account.nomor_rekening}</td>
                      <td className="px-4 py-3 text-gray-600">{account.atas_nama}</td>
                      <td className="px-4 py-3 text-gray-600">{account.cabang_bank || 'Semua Cabang'}</td>
                      <td className="px-4 py-3">
                        <Badge color={isAktif ? 'green' : 'gray'}>
                          {isAktif ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(account)}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <DeleteButton onClick={() => setDeleteId(account.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filteredData.length} rekening bank
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Landmark}
            title="Belum ada rekening bank"
            message="Tambahkan rekening bank untuk menerima pembayaran jamaah."
          />
        )}
      </Card>

      {/* Modal Tambah / Edit Rekening */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Rekening Bank' : 'Tambah Rekening Bank'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Bank <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama_bank}
                    onChange={(e) => setFormData({ ...formData, nama_bank: e.target.value })}
                    placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Rekening <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomor_rekening}
                    onChange={(e) => setFormData({ ...formData, nomor_rekening: e.target.value })}
                    placeholder="Contoh: 7123456789"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atas Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.atas_nama}
                    onChange={(e) => setFormData({ ...formData, atas_nama: e.target.value })}
                    placeholder="Contoh: PT Travel Umroh Mandiri"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cabang
                  </label>
                  <select
                    value={formData.cabang_bank}
                    onChange={(e) => setFormData({ ...formData, cabang_bank: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Semua Cabang">Semua Cabang</option>
                    <option value="Kantor Pusat Jakarta">Kantor Pusat Jakarta</option>
                    <option value="Cabang Surabaya">Cabang Surabaya</option>
                    <option value="Cabang Bandung">Cabang Bandung</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="is_active_rek"
                    checked={formData.aktif}
                    onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="is_active_rek" className="text-sm text-gray-700 select-none cursor-pointer">
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
        title="Hapus Rekening Bank"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
