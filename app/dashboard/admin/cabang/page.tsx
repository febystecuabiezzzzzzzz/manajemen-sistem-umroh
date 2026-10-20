'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { DataService, Cabang } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'

export default function CabangPage() {
  const [cabangList, setCabangList] = useState<Cabang[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { showToast } = useToast()

  const loadData = async () => {
    setLoading(true)
    const data = await DataService.getCabangList()
    setCabangList(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    await DataService.deleteCabang(deleteId)
    showToast('Cabang berhasil dihapus!', 'success')
    setDeleteId(null)
    loadData()
  }

  const filteredData = cabangList.filter(
    (c) =>
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.kota || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <Breadcrumb items={[{ label: 'Cabang' }]} />

      <PageHeader
        title="Cabang"
        subtitle="Daftar cabang travel"
        actions={
          <ActionLink href="/dashboard/admin/cabang/tambah" icon={Building2}>
            Tambah Cabang
          </ActionLink>
        }
      />

      <Card className="mt-6" padding="p-0">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 p-4 border-b border-gray-100">
          <input
            name="q"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama atau kode cabang..."
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
            Memuat data cabang...
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
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Kota
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Telepon
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((branch) => {
                  const isAktif = branch.aktif !== false
                  return (
                    <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{branch.kode}</td>
                      <td className="px-4 py-3 text-gray-800">
                        <span>{branch.nama}</span>
                        {branch.is_pusat && (
                          <Badge color="blue" className="ml-2">
                            Pusat
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{branch.kota || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{branch.telepon || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge color={isAktif ? 'green' : 'gray'}>
                          {isAktif ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link
                          href={`/dashboard/admin/cabang/${branch.id}/edit`}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </Link>
                        <DeleteButton onClick={() => setDeleteId(branch.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filteredData.length} cabang
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="Belum ada cabang"
            message="Tambahkan cabang travel untuk mulai mengelola data."
          />
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Hapus Cabang"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
