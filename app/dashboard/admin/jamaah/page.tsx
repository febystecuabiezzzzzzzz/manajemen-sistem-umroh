'use client'

import React, { useState, useEffect } from 'react'
import { Users, Loader2 } from 'lucide-react'
import { DataService, Jamaah } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'

export default function AdminJamaahPage() {
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Jamaah | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createAccount, setCreateAccount] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState<{ user: string; pass: string } | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    kode: '',
    nik: '',
    nama: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    telepon: '',
    email: '',
    nomor_paspor: '',
    expired_paspor: '2028-12-31',
    nama_agen: 'Pusat (Langsung)',
    aktif: true,
  })

  const loadData = async () => {
    setLoading(true)
    const data = await DataService.getJamaahList()
    setJamaahList(data)
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
      kode: 'JAM-' + Math.floor(1000 + Math.random() * 9000),
      nik: '',
      nama: '',
      jenis_kelamin: 'L',
      telepon: '',
      email: '',
      nomor_paspor: '',
      expired_paspor: '2028-12-31',
      nama_agen: 'Pusat (Langsung)',
      aktif: true,
    })
    setCreateAccount(false)
    setShowModal(true)
  }

  const openEditModal = (item: Jamaah) => {
    setEditingItem(item)
    setFormData({
      kode: (item as any).kode || 'JAM-' + item.id.slice(0, 4),
      nik: item.nik || '',
      nama: item.nama,
      jenis_kelamin: item.jenis_kelamin || 'L',
      telepon: item.telepon || '',
      email: item.email || '',
      nomor_paspor: (item as any).nomor_paspor || (item as any).passport_number || 'A' + item.id.slice(0, 7),
      expired_paspor: (item as any).expired_paspor || '2028-12-31',
      nama_agen: (item as any).nama_agen || 'Pusat (Langsung)',
      aktif: (item as any).status !== 'Batal',
    })
    setCreateAccount(false)
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingItem) {
        await DataService.updateJamaah(editingItem.id, {
          nik: formData.nik,
          nama: formData.nama,
          jenis_kelamin: formData.jenis_kelamin,
          telepon: formData.telepon,
          email: formData.email,
          kode: formData.kode,
          nomor_paspor: formData.nomor_paspor,
          expired_paspor: formData.expired_paspor,
          nama_agen: formData.nama_agen,
        } as any)
        showToast('Data jamaah berhasil diperbarui!', 'success')
      } else {
        await DataService.createJamaah({
          nik: formData.nik || '3201' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
          nama: formData.nama,
          jenis_kelamin: formData.jenis_kelamin,
          telepon: formData.telepon,
          email: formData.email || `${formData.nama.toLowerCase().replace(/\s+/g, '')}@example.com`,
          kota: 'Jakarta',
          paket_nama: 'Umroh Reguler 9 Hari',
          status_pendaftaran: 'Dikonfirmasi',
          status_pembayaran: 'Sebagian',
          kode: formData.kode,
          nomor_paspor: formData.nomor_paspor,
          expired_paspor: formData.expired_paspor,
          nama_agen: formData.nama_agen,
        } as any)

        if (createAccount) {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
          let pass = ''
          for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
          setGeneratedPassword({ user: formData.nama, pass })
          showToast('Jamaah & akun login berhasil dibuat!', 'success')
        } else {
          showToast('Jamaah baru berhasil ditambahkan!', 'success')
        }
      }
      setShowModal(false)
      loadData()
    } catch {
      showToast('Gagal menyimpan jamaah.', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await DataService.deleteJamaah(deleteId)
    showToast('Jamaah berhasil dihapus!', 'success')
    setDeleteId(null)
    loadData()
  }

  const filteredData = jamaahList.filter((j) => {
    const isAktif = (j as any).status !== 'Batal'
    const matchStatus =
      !statusFilter ||
      (statusFilter === 'active' && isAktif) ||
      (statusFilter === 'inactive' && !isAktif)

    const matchQuery =
      j.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.nik.includes(searchQuery) ||
      ((j as any).kode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((j as any).nomor_paspor || '').toLowerCase().includes(searchQuery.toLowerCase())

    return matchStatus && matchQuery
  })

  return (
    <div>
      <Breadcrumb items={[{ label: 'Jamaah' }]} />

      <PageHeader
        title="Jamaah"
        subtitle="Daftar jamaah umroh & haji"
        actions={
          <ActionLink onClick={openAddModal} icon={Users}>
            Tambah Jamaah
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
            placeholder="Cari nama / NIK / paspor..."
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
            Memuat data jamaah...
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
                    NIK
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Kontak
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Paspor
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Agen
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((pilgrim) => {
                  const code = (pilgrim as any).kode || 'JAM-' + pilgrim.id.slice(0, 4)
                  const isMale = pilgrim.jenis_kelamin === 'L' || (pilgrim as any).jenis_kelamin === 'Laki-laki'
                  const passport = (pilgrim as any).nomor_paspor || 'A' + pilgrim.id.slice(0, 7)
                  const agentName = (pilgrim as any).nama_agen || 'Pusat (Langsung)'

                  return (
                    <tr key={pilgrim.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{pilgrim.nama}</div>
                        <div className="text-xs text-gray-400">{code}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={isMale ? 'blue' : 'pink'}>
                          {isMale ? 'Laki-laki' : 'Perempuan'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {pilgrim.nik || '-'}
                      </td>
                      <td className="px-4 py-3">
                        {pilgrim.telepon ? (
                          <a
                            href={`https://wa.me/${pilgrim.telepon.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand text-sm hover:underline"
                          >
                            {pilgrim.telepon}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                        <div className="text-xs text-gray-400">{pilgrim.email || ''}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600 font-mono">{passport}</div>
                        <div className="text-xs text-gray-400">Exp Des 2028</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{agentName}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(pilgrim)}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <DeleteButton onClick={() => setDeleteId(pilgrim.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filteredData.length} jamaah
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Belum ada jamaah"
            message="Tambahkan jamaah untuk mulai pendaftaran paket."
          />
        )}
      </Card>

      {/* Modal Tambah / Edit Jamaah */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Jamaah' : 'Tambah Jamaah'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Sesuai KTP / Paspor"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK (16 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="3201xxxxxxxxxxxx"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
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
                    placeholder="08123456789"
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
                    placeholder="jamaah@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Paspor
                  </label>
                  <input
                    type="text"
                    value={formData.nomor_paspor}
                    onChange={(e) => setFormData({ ...formData, nomor_paspor: e.target.value.toUpperCase() })}
                    placeholder="Contoh: A1234567"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Masa Berlaku Paspor
                  </label>
                  <input
                    type="date"
                    value={formData.expired_paspor}
                    onChange={(e) => setFormData({ ...formData, expired_paspor: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mitra Agen Referral
                  </label>
                  <input
                    type="text"
                    value={formData.nama_agen}
                    onChange={(e) => setFormData({ ...formData, nama_agen: e.target.value })}
                    placeholder="Pusat (Langsung) / Nama Agen"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                {!editingItem && (
                  <div className="flex items-center gap-2 pt-1 sm:col-span-2">
                    <input
                      type="checkbox"
                      id="create_pilgrim_account"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="create_pilgrim_account" className="text-sm text-gray-700 select-none cursor-pointer">
                      Buat akun login jamaah (portal jamaah mandiri)
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
        title="Hapus Jamaah"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
