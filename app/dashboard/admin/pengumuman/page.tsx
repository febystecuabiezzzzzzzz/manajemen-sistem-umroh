'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Plus, Megaphone, Trash2, X } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface PengumumanItem {
  id: string
  judul: string
  isi: string
  target: 'Semua Pengguna' | 'Jamaah' | 'Muthawif' | 'Agen'
  tanggal: string
}

const initialData: PengumumanItem[] = [
  { id: '1', judul: 'Pelunasan Umroh Reguler', isi: 'Mohon segera melunasi biaya paket Umroh Reguler sebelum H-30 keberangkatan.', target: 'Jamaah', tanggal: '04 Oct 2026' },
  { id: '2', judul: 'Jadwal Manasik Akbar', isi: 'Manasik akbar akan dilaksanakan akhir bulan ini di aula utama. Wajib hadir.', target: 'Semua Pengguna', tanggal: '03 Oct 2026' },
]

export default function PengumumanPage() {
  const [list, setList] = useState<PengumumanItem[]>(initialData)
  const [showModal, setShowModal] = useState(false)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
    target: 'Semua Pengguna' as 'Semua Pengguna' | 'Jamaah' | 'Muthawif' | 'Agen',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: PengumumanItem = {
      id: String(Date.now()),
      ...formData,
      tanggal: '12 Oct 2026',
    }
    setList([newItem, ...list])
    showToast('Pengumuman baru berhasil diterbitkan!', 'success')
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setList(list.filter((p) => p.id !== id))
    showToast('Pengumuman berhasil dihapus!', 'success')
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/admin" className="hover:text-slate-600">Beranda</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Pengumuman</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Broadcast Pengumuman</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kirim informasi dan broadcast pesan ke portal Jamaah atau Muthawif</p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d6962] transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={15} />
          <span>Buat Pengumuman</span>
        </button>
      </div>

      <div className="space-y-3">
        {list.map((p) => (
          <div key={p.id} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-600">
                  {p.target}
                </span>
                <span className="text-xs text-slate-400">{p.tanggal}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">{p.judul}</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{p.isi}</p>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(p.id)}
              className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Buat Pengumuman Baru</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Pengguna</label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                >
                  <option value="Semua Pengguna">Semua Pengguna</option>
                  <option value="Jamaah">Khusus Jamaah</option>
                  <option value="Muthawif">Khusus Muthawif</option>
                  <option value="Agen">Khusus Agen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Pengambilan Koper dan Perlengkapan"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Pesan *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.isi}
                  onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  placeholder="Tuliskan detail pengumuman..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d6962] cursor-pointer"
                >
                  Terbitkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
