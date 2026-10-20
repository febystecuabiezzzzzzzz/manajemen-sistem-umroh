'use client'

import React, { useState, useEffect } from 'react'
import { Hotel as HotelIcon, Loader2 } from 'lucide-react'
import { DataService, Hotel } from '@/lib/data-service'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { DeleteButton } from '@/components/DeleteButton'

export default function HotelPage() {
  const [hotelList, setHotelList] = useState<Hotel[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Hotel | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    nama: '',
    kota: 'Mekah' as 'Mekah' | 'Madinah',
    bintang: 5,
    jarak_masjid: '50 m',
    alamat: '',
    telepon: '',
    aktif: true,
  })

  const loadData = async () => {
    setLoading(true)
    const data = await DataService.getHotelList()
    setHotelList(data)
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
      nama: '',
      kota: 'Mekah',
      bintang: 5,
      jarak_masjid: '50 m',
      alamat: '',
      telepon: '',
      aktif: true,
    })
    setShowModal(true)
  }

  const openEditModal = (hotel: Hotel) => {
    setEditingItem(hotel)
    const normCity = hotel.kota.includes('Madinah') ? 'Madinah' : 'Mekah'
    setFormData({
      nama: hotel.nama,
      kota: normCity,
      bintang: hotel.bintang || 5,
      jarak_masjid: hotel.jarak_masjid || '100 m',
      alamat: hotel.alamat || '',
      telepon: hotel.telepon || '',
      aktif: (hotel as any).aktif !== false,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingItem) {
        await DataService.updateHotel(editingItem.id, {
          nama: formData.nama,
          kota: formData.kota as any,
          bintang: formData.bintang,
          jarak_masjid: formData.jarak_masjid,
          alamat: formData.alamat,
          telepon: formData.telepon,
          aktif: formData.aktif,
        } as any)
        showToast('Hotel berhasil diperbarui!', 'success')
      } else {
        await DataService.createHotel({
          nama: formData.nama,
          kota: formData.kota as any,
          bintang: formData.bintang,
          jarak_masjid: formData.jarak_masjid,
          alamat: formData.alamat,
          telepon: formData.telepon,
          aktif: formData.aktif,
        } as any)
        showToast('Hotel baru berhasil ditambahkan!', 'success')
      }
      setShowModal(false)
      loadData()
    } catch {
      showToast('Gagal menyimpan hotel.', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await DataService.deleteHotel(deleteId)
    showToast('Hotel berhasil dihapus!', 'success')
    setDeleteId(null)
    loadData()
  }

  const filteredData = hotelList.filter((h) => {
    const matchCity =
      !cityFilter ||
      (cityFilter === 'Mekah' && (h.kota.includes('Mekah') || h.kota.includes('Makkah'))) ||
      (cityFilter === 'Madinah' && h.kota.includes('Madinah'))

    const matchQuery =
      h.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.kota.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.alamat || '').toLowerCase().includes(searchQuery.toLowerCase())

    return matchCity && matchQuery
  })

  return (
    <div>
      <Breadcrumb items={[{ label: 'Hotel' }]} />

      <PageHeader
        title="Hotel"
        subtitle="Daftar hotel Mekah & Madinah"
        actions={
          <ActionLink onClick={openAddModal} icon={HotelIcon}>
            Tambah Hotel
          </ActionLink>
        }
      />

      <Card className="mt-6" padding="p-0">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 p-4 border-b border-gray-100">
          <input
            name="q"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama hotel..."
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          />
          <select
            name="city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
          >
            <option value="">Semua Kota</option>
            <option value="Mekah">Mekah</option>
            <option value="Madinah">Madinah</option>
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
            Memuat data hotel...
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Hotel
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Kota
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Bintang
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Jarak ke Masjid
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((hotel) => {
                  const isAktif = (hotel as any).aktif !== false
                  const stars = '★'.repeat(hotel.bintang || 5)

                  return (
                    <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{hotel.nama}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {hotel.kota.includes('Madinah') ? 'Madinah' : 'Mekah'}
                      </td>
                      <td className="px-4 py-3 text-amber-500 font-serif tracking-widest">{stars}</td>
                      <td className="px-4 py-3 text-gray-600">{hotel.jarak_masjid || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge color={isAktif ? 'green' : 'gray'}>
                          {isAktif ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(hotel)}
                          className="text-brand text-sm hover:underline mr-3 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <DeleteButton onClick={() => setDeleteId(hotel.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
              Menampilkan {filteredData.length} hotel
            </div>
          </div>
        ) : (
          <EmptyState
            icon={HotelIcon}
            title="Belum ada hotel"
            message="Tambahkan hotel untuk dipakai pada akomodasi paket."
          />
        )}
      </Card>

      {/* Modal Tambah / Edit Hotel */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Hotel' : 'Tambah Hotel'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Hotel <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Pullman ZamZam Makkah"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kota <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.kota}
                    onChange={(e) => setFormData({ ...formData, kota: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value="Mekah">Mekah</option>
                    <option value="Madinah">Madinah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bintang
                  </label>
                  <select
                    value={formData.bintang}
                    onChange={(e) => setFormData({ ...formData, bintang: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-gray-700 bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (Bintang 5)</option>
                    <option value={4}>⭐⭐⭐⭐ (Bintang 4)</option>
                    <option value={3}>⭐⭐⭐ (Bintang 3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jarak ke Masjid
                  </label>
                  <input
                    type="text"
                    value={formData.jarak_masjid}
                    onChange={(e) => setFormData({ ...formData, jarak_masjid: e.target.value })}
                    placeholder="Contoh: 50 m"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telepon
                  </label>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    placeholder="Contoh: +966 12 571 5555"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Abraj Al Bait Complex, Mecca"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="is_active_hotel"
                    checked={formData.aktif}
                    onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="is_active_hotel" className="text-sm text-gray-700 select-none cursor-pointer">
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
        title="Hapus Hotel"
        message="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
