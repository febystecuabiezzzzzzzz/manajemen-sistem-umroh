'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { DataService, Cabang } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'

export default function EditCabangPage() {
  const router = useRouter()
  const params = useParams()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const id = params?.id as string

  const [formData, setFormData] = useState<Cabang>({
    id: '',
    kode: '',
    nama: '',
    telepon: '',
    email: '',
    kota: '',
    alamat: '',
    aktif: true,
    is_pusat: false,
  })

  useEffect(() => {
    const fetchCabang = async () => {
      if (!id) return
      setFetching(true)
      const data = await DataService.getCabangById(id)
      if (data) {
        setFormData(data)
      } else {
        showToast('Data cabang tidak ditemukan!', 'error')
        router.push('/dashboard/admin/cabang')
      }
      setFetching(false)
    }

    fetchCabang()
  }, [id, router, showToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.kode.trim() || !formData.nama.trim()) {
      showToast('Kode dan Nama Cabang wajib diisi!', 'error')
      return
    }

    setLoading(true)
    try {
      await DataService.updateCabang(id, formData)
      showToast('Perubahan cabang berhasil disimpan!', 'success')
      router.push('/dashboard/admin/cabang')
      router.refresh()
    } catch {
      showToast('Gagal mengupdate cabang. Silakan coba lagi.', 'error')
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        Memuat data cabang...
      </div>
    )
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Cabang', href: '/dashboard/admin/cabang' },
          { label: 'Edit' },
        ]}
      />

      <PageHeader title="Edit Cabang" subtitle={formData.nama} />

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl">
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="kode" className="block text-sm font-medium text-gray-700 mb-1">
                Kode <span className="text-red-500">*</span>
              </label>
              <input
                id="kode"
                type="text"
                required
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                placeholder="Contoh: BDG"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              />
            </div>

            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Cabang <span className="text-red-500">*</span>
              </label>
              <input
                id="nama"
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Cabang Bandung"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              />
            </div>

            <div>
              <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-1">
                Telepon
              </label>
              <input
                id="telepon"
                type="text"
                value={formData.telepon || ''}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                placeholder="Contoh: 022-1234567"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Contoh: bandung@travel.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="kota" className="block text-sm font-medium text-gray-700 mb-1">
                Kota
              </label>
              <input
                id="kota"
                type="text"
                value={formData.kota || ''}
                onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                placeholder="Contoh: Bandung"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <textarea
                id="alamat"
                rows={3}
                value={formData.alamat || ''}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Alamat lengkap kantor cabang"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.aktif}
                onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700 select-none cursor-pointer">
                Aktif
              </label>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_head_office"
                checked={formData.is_pusat}
                onChange={(e) => setFormData({ ...formData, is_pusat: e.target.checked })}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="is_head_office" className="text-sm text-gray-700 select-none cursor-pointer">
                Kantor Pusat
              </label>
            </div>
          </div>
        </Card>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark text-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Simpan Perubahan
          </button>
          <Link
            href="/dashboard/admin/cabang"
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  )
}
