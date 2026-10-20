'use client'

import React, { useState } from 'react'
import { Users, Loader2 } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge, BadgeColor } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export type UserRoleName =
  | 'Super Admin'
  | 'Admin Cabang'
  | 'Agen / Marketing'
  | 'Jamaah'
  | 'Muthawif / Pembimbing'

interface UserItem {
  id: string
  nama: string
  email: string
  role: UserRoleName
  cabang: string
  status: 'Aktif' | 'Nonaktif'
  loginTerakhir: string
}

const initialUsers: UserItem[] = [
  { id: '1', nama: 'Super Admin Travel', email: 'superadmin@example.com', role: 'Super Admin', cabang: 'Kantor Pusat Jakarta', status: 'Aktif', loginTerakhir: '16 Okt 2026 09:42' },
  { id: '2', nama: 'Admin Cabang Surabaya', email: 'admin.sby@example.com', role: 'Admin Cabang', cabang: 'Cabang Surabaya', status: 'Aktif', loginTerakhir: '15 Okt 2026 14:20' },
  { id: '3', nama: 'H. Suherman (Mitra)', email: 'agen@example.com', role: 'Agen / Marketing', cabang: 'Kantor Pusat Jakarta', status: 'Aktif', loginTerakhir: '14 Okt 2026 11:15' },
  { id: '4', nama: 'Ustadz Abdullah, Lc.', email: 'muthawif@example.com', role: 'Muthawif / Pembimbing', cabang: 'Kantor Pusat Jakarta', status: 'Aktif', loginTerakhir: '16 Okt 2026 08:30' },
  { id: '5', nama: 'Ahmad Fauzi', email: 'jamaah@example.com', role: 'Jamaah', cabang: 'Kantor Pusat Jakarta', status: 'Aktif', loginTerakhir: '12 Okt 2026 16:05' },
  { id: '6', nama: 'Siti Aminah', email: 'aminah@example.com', role: 'Jamaah', cabang: 'Kantor Pusat Jakarta', status: 'Aktif', loginTerakhir: '10 Okt 2026 19:22' },
]

export default function PenggunaPage() {
  const [list, setList] = useState<UserItem[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState<{ user: string; pass: string } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    role: 'Admin Cabang' as UserRoleName,
    cabang: 'Kantor Pusat Jakarta',
    aktif: true,
  })

  const openAddModal = () => {
    setEditingUser(null)
    setFormData({
      nama: '',
      email: '',
      role: 'Admin Cabang',
      cabang: 'Kantor Pusat Jakarta',
      aktif: true,
    })
    setShowModal(true)
  }

  const openEditModal = (user: UserItem) => {
    setEditingUser(user)
    setFormData({
      nama: user.nama,
      email: user.email,
      role: user.role,
      cabang: user.cabang,
      aktif: user.status === 'Aktif',
    })
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      setList(
        list.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                nama: formData.nama,
                email: formData.email,
                role: formData.role,
                cabang: formData.cabang,
                status: formData.aktif ? 'Aktif' : 'Nonaktif',
              }
            : u
        )
      )
      showToast('Data pengguna berhasil diperbarui!', 'success')
    } else {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
      let pass = ''
      for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))

      const newUser: UserItem = {
        id: String(Date.now()),
        nama: formData.nama,
        email: formData.email,
        role: formData.role,
        cabang: formData.cabang,
        status: formData.aktif ? 'Aktif' : 'Nonaktif',
        loginTerakhir: '-',
      }
      setList([newUser, ...list])
      setGeneratedPassword({ user: formData.nama, pass })
      showToast('Pengguna baru berhasil ditambahkan!', 'success')
    }
    setShowModal(false)
  }

  const handleResetPassword = (user: UserItem) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let pass = ''
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
    setGeneratedPassword({ user: user.nama, pass })
    showToast(`Password untuk ${user.nama} berhasil direset!`, 'success')
  }

  const handleDelete = () => {
    if (!deleteId) return
    setList(list.filter((u) => u.id !== deleteId))
    showToast('Pengguna berhasil dihapus!', 'success')
    setDeleteId(null)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const filtered = list.filter((u) => {
    const matchRole = !roleFilter || u.role === roleFilter
    const matchSearch =
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.cabang.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const getRoleBadgeColor = (role: UserRoleName): BadgeColor => {
    switch (role) {
      case 'Super Admin':
        return 'purple'
      case 'Admin Cabang':
        return 'blue'
      case 'Agen / Marketing':
        return 'amber'
      case 'Muthawif / Pembimbing':
        return 'teal'
      default:
        return 'gray'
    }
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Pengguna' }]} />

      <PageHeader
        title="Pengguna"
        subtitle="Kelola akun login"
        actions={
          <ActionLink onClick={openAddModal} icon={Users}>
            Tambah Pengguna
          </ActionLink>
        }
      />

      {generatedPassword && (
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          <strong>Akun login dibuat/direset.</strong> Password sementara untuk{' '}
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
            placeholder="Cari nama / email..."
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          />
          <select
            name="role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
          >
            <option value="">Semua Role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin Cabang">Admin Cabang</option>
            <option value="Agen / Marketing">Agen</option>
            <option value="Muthawif / Pembimbing">Muthawif</option>
            <option value="Jamaah">Jamaah</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200 transition text-gray-700 cursor-pointer"
          >
            Cari
          </button>
        </form>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Cabang
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Login Terakhir
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((u) => {
                  const isAktif = u.status === 'Aktif'
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{u.nama}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge color={getRoleBadgeColor(u.role)}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.cabang || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge color={isAktif ? 'green' : 'gray'}>
                          {isAktif ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{u.loginTerakhir}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetPassword(u)}
                          className="text-amber-600 text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Reset Sandi
                        </button>
                        {u.role !== 'Super Admin' && (
                          <DeleteButton onClick={() => setDeleteId(u.id)} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filtered.length} pengguna
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Belum ada pengguna"
            message="Tambahkan akun login untuk staff, agen, jamaah, atau muthawif."
          />
        )}
      </Card>

      {/* Modal Tambah / Edit Pengguna */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Nama lengkap"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRoleName })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin Cabang">Admin Cabang</option>
                    <option value="Agen / Marketing">Agen / Marketing</option>
                    <option value="Muthawif / Pembimbing">Muthawif / Pembimbing</option>
                    <option value="Jamaah">Jamaah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cabang
                  </label>
                  <select
                    value={formData.cabang}
                    onChange={(e) => setFormData({ ...formData, cabang: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Kantor Pusat Jakarta">Kantor Pusat Jakarta</option>
                    <option value="Cabang Surabaya">Cabang Surabaya</option>
                    <option value="Cabang Bandung">Cabang Bandung</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="user_active"
                    checked={formData.aktif}
                    onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="user_active" className="text-sm text-gray-700 select-none cursor-pointer">
                    Aktif
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark text-sm transition cursor-pointer"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Simpan'}
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
        title="Hapus Pengguna"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
