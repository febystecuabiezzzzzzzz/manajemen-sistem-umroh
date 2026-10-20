'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Plus, Search, Receipt, CheckCircle2, X, Loader2, Printer } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { KwitansiModal, KwitansiData } from '@/components/PrintTemplates'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { ActionLink } from '@/components/ActionLink'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'

interface PembayaranRow {
  id: string
  no_kuitansi: string
  jamaah: string
  paket: string
  tanggal: string
  metode: string
  jumlah: number
  status: 'Lunas' | 'Sebagian'
}

export default function PembayaranPage() {
  const [list, setList] = useState<PembayaranRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [printPayment, setPrintPayment] = useState<KwitansiData | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    jamaah: '',
    paket: 'Umroh Reguler 9 Hari',
    metode: 'Transfer BSI',
    jumlah: 10000000,
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pembayaran')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setList(json.data)
      }
    } catch {
      showToast('Gagal memuat data pembayaran dari database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/pembayaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const json = await res.json()
      if (json.success) {
        showToast('Pembayaran berhasil dicatat & kuitansi terbit!', 'success')
        setShowModal(false)
        setFormData({
          jamaah: '',
          paket: 'Umroh Reguler 9 Hari',
          metode: 'Transfer BSI',
          jumlah: 10000000,
        })
        loadData()
      } else {
        showToast(json.error || 'Gagal mencatat pembayaran', 'error')
      }
    } catch {
      showToast('Terjadi kesalahan koneksi server', 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered = list.filter(
    (p) =>
      p.jamaah.toLowerCase().includes(search.toLowerCase()) ||
      p.no_kuitansi.toLowerCase().includes(search.toLowerCase()) ||
      p.paket.toLowerCase().includes(search.toLowerCase())
  )

  const totalOmzet = list.reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0)

  return (
    <div>
      <Breadcrumb items={[{ label: 'Pembayaran' }]} />

      <PageHeader
        title="Pembayaran & Cicilan"
        subtitle="Daftar tagihan & kuitansi pembayaran jamaah"
        actions={
          <ActionLink onClick={() => setShowModal(true)} icon={Plus}>
            Catat Pembayaran Baru
          </ActionLink>
        }
      />

      <Card className="mt-6" padding="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Cari no kuitansi atau nama jamaah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none max-w-sm w-full"
          />
          <div className="text-xs text-gray-500 font-medium">
            Total Tercatat: <strong className="text-gray-800 text-sm">Rp {totalOmzet.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Memuat data pembayaran...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Belum ada pembayaran"
            message="Data transaksi pembayaran akan tampil di sini setelah dicatat."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    No. Kuitansi
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Jamaah
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Paket
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Metode
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-gray-800">{row.no_kuitansi}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.jamaah}</td>
                    <td className="px-4 py-3 text-gray-600">{row.paket}</td>
                    <td className="px-4 py-3 text-gray-600">{row.tanggal}</td>
                    <td className="px-4 py-3 text-gray-600">{row.metode}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">Rp {Number(row.jumlah).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">
                      <Badge color={row.status === 'Lunas' ? 'green' : 'amber'}>
                        {row.status}
                      </Badge>
                    </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setPrintPayment({
                          no_kuitansi: row.no_kuitansi,
                          tanggal: row.tanggal,
                          jamaah: row.jamaah,
                          jenis: row.status === 'Lunas' ? 'Pelunasan Paket' : 'Cicilan / Uang Muka',
                          paket: row.paket,
                          no_pendaftaran: `REG-${row.id.slice(0, 6).toUpperCase()}`,
                          metode: row.metode,
                          via_bank: 'Bank Syariah Indonesia (BSI)',
                          jumlah: Number(row.jumlah),
                          total_tagihan: 28500000,
                          sisa_tagihan: row.status === 'Lunas' ? 0 : 18500000,
                          penerima: 'Staf Administrasi Travel',
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-[#0f766e] bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                    >
                      <Printer size={12} />
                      <span>Kwitansi</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>

      {/* Kwitansi Printable Modal */}
      {printPayment && (
        <KwitansiModal
          data={printPayment}
          onClose={() => setPrintPayment(null)}
        />
      )}

      {/* Modal Catat Pembayaran */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Catat Pembayaran Baru</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Jamaah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Fauzi"
                  value={formData.jamaah}
                  onChange={(e) => setFormData({ ...formData, jamaah: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                <select
                  value={formData.metode}
                  onChange={(e) => setFormData({ ...formData, metode: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                >
                  <option value="Transfer Bank BSI">Transfer Bank Syariah Indonesia (BSI)</option>
                  <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                  <option value="Transfer Bank BCA Syariah">Transfer BCA Syariah</option>
                  <option value="Tunai / Cash">Tunai / Cash di Kantor Pusat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Pembayaran (Rp)</label>
                <input
                  type="number"
                  required
                  min={100000}
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d6962] transition-colors shadow-xs disabled:opacity-50"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>{saving ? 'Menyimpan...' : 'Terbitkan Kuitansi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
