'use client'

import React, { useState, useEffect } from 'react'
import { UserCheck, Loader2 } from 'lucide-react'
import { DataService, Muthawif } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'

export default function AdminMuthawifPage() {
  const [muthawifList, setMuthawifList] = useState<Muthawif[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Muthawif | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createAccount, setCreateAccount] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState<{ user: string; pass: string } | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    telepon: '',
    email: '',
    spesialisasi: 'Fiqih Manasik',
    aktif: true,
  })

  const loadData = async () => {
    setLoading(true)
    const data = await DataService.getMuthawifList()
    setMuthawifList(data)
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
      gender: 'Laki-laki',
      telepon: '',
      email: '',
      spesialisasi: 'Fiqih Manasik',
      aktif: true,
    })
    setCreateAccount(false)
    setShowModal(true)
  }

  const openEditModal = (item: Muthawif) => {
    setEditingItem(item)
    setFormData({
      kode: (item as any).kode || '',
      nama: item.nama,
      gender: ((item as any).gender || 'Laki-laki') as any,
      telepon: item.telepon || '',
      email: item.email || '',
      spesialisasi: (item as any).spesialisasi || item.bahasa || 'Fiqih Manasik',
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
        await DataService.updateMuthawif(editingItem.id, {
          kode: formData.kode,
          nama: formData.nama,
          gender: formData.gender,
          telepon: formData.telepon,
          email: formData.email,
          spesialisasi: formData.spesialisasi,
          bahasa: formData.spesialisasi,
          status: formData.aktif ? 'Aktif' : 'Nonaktif',
        } as any)
        showToast('Data muthawif berhasil diperbarui!', 'success')
      } else {
        await DataService.createMuthawif({
          kode: formData.kode,
          nama: formData.nama,
          gender: formData.gender,
          telepon: formData.telepon,
          email: formData.email,
          spesialisasi: formData.spesialisasi,
          bahasa: formData.spesialisasi,
          pengalaman_tahun: 5,
          status: formData.aktif ? 'Aktif' : 'Nonaktif',
        } as any)

        if (createAccount) {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
          let pass = ''
          for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
          setGeneratedPassword({ user: formData.nama, pass })
          showToast('Muthawif & akun login berhasil dibuat!', 'success')
        } else {
          showToast('Muthawif baru berhasil ditambahkan!', 'success')
        }
      }
      setShowModal(false)
      loadData()
    } catch {
      showToast('Gagal menyimpan muthawif.', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await DataService.deleteMuthawif(deleteId)
    showToast('Muthawif berhasil dihapus!', 'success')
    setDeleteId(null)
    loadData()
  }

  const filteredData = muthawifList.filter((m) => {
    const isAktif = m.status !== 'Nonaktif'
    const matchStatus =
      !statusFilter ||
      (statusFilter === 'active' && isAktif) ||
      (statusFilter === 'inactive' && !isAktif)

    const matchQuery =
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((m as any).kode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.telepon.includes(searchQuery)

    return matchStatus && matchQuery
  })

  return (
    <div>
      <Breadcrumb items={[{ label: 'Muthawif' }]} />

      <PageHeader
        title="Muthawif / Pembimbing"
        subtitle="Daftar muthawif & pembimbing ibadah"
        actions={
          <ActionLink onClick={openAddModal} icon={UserCheck}>
            Tambah Muthawif
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
            Memuat data muthawif...
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
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Kontak
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Spesialisasi
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
                {filteredData.map((guide) => {
                  const isAktif = guide.status !== 'Nonaktif'
                  const gender = (guide as any).gender || 'Laki-laki'
                  const code = (guide as any).kode || 'MUT-00' + guide.id
                  const spec = (guide as any).spesialisasi || guide.bahasa || 'Fiqih Manasik'
                  const hasAccount = Boolean(guide.email)

                  return (
                    <tr key={guide.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{guide.nama}</div>
                        <div className="text-xs text-gray-400">{code}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={gender === 'Laki-laki' ? 'blue' : 'pink'}>{gender}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {guide.telepon ? (
                          <a
                            href={`https://wa.me/${guide.telepon.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand text-sm hover:underline"
                          >
                            {guide.telepon}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                        <div className="text-xs text-gray-400">{guide.email || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{spec}</td>
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
                          onClick={() => openEditModal(guide)}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <DeleteButton onClick={() => setDeleteId(guide.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filteredData.length} muthawif
            </div>
          </div>
        ) : (
          <EmptyState
            icon={UserCheck}
            title="Belum ada muthawif"
            message="Tambahkan muthawif untuk membimbing pelaksanaan ibadah umroh/haji."
          />
        )}
      </Card>

      {/* Modal Tambah / Edit Muthawif */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Muthawif' : 'Tambah Muthawif'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Muthawif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                    placeholder="Contoh: MUT-001"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap & Gelar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Ustadz Abdullah, Lc."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
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
                    placeholder="muthawif@travel.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spesialisasi
                  </label>
                  <input
                    type="text"
                    value={formData.spesialisasi}
                    onChange={(e) => setFormData({ ...formData, spesialisasi: e.target.value })}
                    placeholder="Contoh: Fiqih Manasik & Sejarah Haramain"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="is_active_guide"
                    checked={formData.aktif}
                    onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="is_active_guide" className="text-sm text-gray-700 select-none cursor-pointer">
                    Aktif
                  </label>
                </div>

                {!editingItem && (
                  <div className="flex items-center gap-2 pt-1 sm:col-span-2">
                    <input
                      type="checkbox"
                      id="create_guide_account"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="create_guide_account" className="text-sm text-gray-700 select-none cursor-pointer">
                      Buat akun login muthawif (password akan di-generate otomatis)
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
        title="Hapus Muthawif"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
