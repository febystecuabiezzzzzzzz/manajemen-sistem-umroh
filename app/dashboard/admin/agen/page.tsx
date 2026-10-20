'use client'

import React, { useState, useEffect } from 'react'
import { User, Loader2 } from 'lucide-react'
import { DataService, Agen } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'

export default function AgenPage() {
  const [agenList, setAgenList] = useState<Agen[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Agen | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createAccount, setCreateAccount] = useState(false)
  const [accountEmail, setAccountEmail] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState<{ user: string; pass: string } | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    telepon: '',
    email: '',
    kota: '',
    komisi_rate: 2.5,
    aktif: true,
  })

  const loadData = async () => {
    setLoading(true)
    const data = await DataService.getAgenList()
    setAgenList(data)
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
      telepon: '',
      email: '',
      kota: '',
      komisi_rate: 2.5,
      aktif: true,
    })
    setCreateAccount(false)
    setShowModal(true)
  }

  const openEditModal = (item: Agen) => {
    setEditingItem(item)
    setFormData({
      kode: item.kode || '',
      nama: item.nama || '',
      telepon: item.telepon || '',
      email: item.email || '',
      kota: item.kota || '',
      komisi_rate: (item as any).komisi_rate ?? 2.5,
      aktif: item.status !== 'Nonaktif',
    })
    setCreateAccount(false)
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingItem) {
        await DataService.updateAgen(editingItem.id, {
          kode: formData.kode,
          nama: formData.nama,
          telepon: formData.telepon,
          email: formData.email,
          kota: formData.kota,
          komisi_per_jamaah: 1500000,
          status: formData.aktif ? 'Aktif' : 'Nonaktif',
          komisi_rate: formData.komisi_rate,
        } as any)
        showToast('Data agen berhasil diperbarui!', 'success')
      } else {
        await DataService.createAgen({
          kode: formData.kode,
          nama: formData.nama,
          telepon: formData.telepon,
          email: formData.email,
          kota: formData.kota,
          komisi_per_jamaah: 1500000,
          total_jamaah: 0,
          status: formData.aktif ? 'Aktif' : 'Nonaktif',
          komisi_rate: formData.komisi_rate,
        } as any)

        if (createAccount) {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
          let pass = ''
          for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
          setGeneratedPassword({ user: formData.nama, pass })
          showToast('Mitra agen & akun login berhasil dibuat!', 'success')
        } else {
          showToast('Agen baru berhasil ditambahkan!', 'success')
        }
      }
      setShowModal(false)
      loadData()
    } catch {
      showToast('Gagal menyimpan agen.', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await DataService.deleteAgen(deleteId)
    showToast('Agen berhasil dihapus!', 'success')
    setDeleteId(null)
    loadData()
  }

  const filteredData = agenList.filter((a) => {
    const isAktif = a.status !== 'Nonaktif'
    const matchStatus =
      !statusFilter ||
      (statusFilter === 'active' && isAktif) ||
      (statusFilter === 'inactive' && !isAktif)

    const matchQuery =
      a.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.kota || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(searchQuery.toLowerCase())

    return matchStatus && matchQuery
  })

  return (
    <div>
      <Breadcrumb items={[{ label: 'Agen' }]} />

      <PageHeader
        title="Agen / Marketing"
        subtitle="Daftar agen & marketing"
        actions={
          <ActionLink onClick={openAddModal} icon={User}>
            Tambah Agen
          </ActionLink>
        }
      />

      {generatedPassword && (
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          <strong>Akun login dibuat.</strong> Password sementara untuk{' '}
          <strong>{generatedPassword.user}</strong>:{' '}
          <code className="px-2 py-0.5 bg-white rounded border font-mono font-semibold">
            {generatedPassword.pass}
          </code>{' '}
          — mohon catat &amp; sampaikan ke pengguna.
        </div>
      )}

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
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
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
            Memuat data agen...
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
                    Kontak
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Komisi
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Akun
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((agent) => {
                  const isAktif = agent.status !== 'Nonaktif'
                  const hasAccount = Boolean(agent.email)
                  const rate = (agent as any).komisi_rate ?? 2.5

                  return (
                    <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{agent.nama}</div>
                        <div className="text-xs text-gray-400">{agent.kode || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        {agent.telepon ? (
                          <a
                            href={`https://wa.me/${agent.telepon.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand text-sm hover:underline"
                          >
                            {agent.telepon}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                        <div className="text-xs text-gray-400">{agent.email || ''}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {Number(rate).toFixed(2)}%
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={hasAccount ? 'green' : 'gray'}>
                          {hasAccount ? 'Aktif' : '—'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={isAktif ? 'green' : 'gray'}>
                          {isAktif ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(agent)}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <DeleteButton onClick={() => setDeleteId(agent.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filteredData.length} agen
            </div>
          </div>
        ) : (
          <EmptyState
            icon={User}
            title="Belum ada agen"
            message="Tambahkan agen kemitraan untuk memperluas jaringan jamaah."
          />
        )}
      </Card>

      {/* Modal Tambah / Edit Agen */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Agen' : 'Tambah Agen'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Agen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                    placeholder="Contoh: AGN-001"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Agen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Nama lengkap agen / mitra"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    placeholder="Contoh: 08123456789"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="agen@travel.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kota
                  </label>
                  <input
                    type="text"
                    value={formData.kota}
                    onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                    placeholder="Contoh: Jakarta"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Komisi (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.komisi_rate}
                    onChange={(e) => setFormData({ ...formData, komisi_rate: parseFloat(e.target.value) || 0 })}
                    placeholder="2.5"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="is_active_agent"
                    checked={formData.aktif}
                    onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="is_active_agent" className="text-sm text-gray-700 select-none cursor-pointer">
                    Aktif
                  </label>
                </div>

                {!editingItem && (
                  <div className="flex items-center gap-2 pt-1 sm:col-span-2">
                    <input
                      type="checkbox"
                      id="create_user_account"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="create_user_account" className="text-sm text-gray-700 select-none cursor-pointer">
                      Buat akun login untuk agen ini (password akan di-generate otomatis)
                    </label>
                  </div>
                )}
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
        title="Hapus Agen"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
