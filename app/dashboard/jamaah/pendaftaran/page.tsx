'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Eye,
  FileText,
  CreditCard,
  Building,
  Calendar,
  User,
  Plane,
  X,
  Printer,
  ExternalLink,
} from 'lucide-react'

interface RegistrationItem {
  id: string
  code: string
  pilgrimName: string
  passportNumber: string
  phone: string
  packageName: string
  packageType: string
  status: 'Dikonfirmasi' | 'Menunggu' | 'Batal'
  paymentStatus: 'Lunas' | 'Sebagian' | 'Belum Bayar'
  registeredAt: string
  departureDate: string
  branchName: string
  guideName: string
  agentName: string
  totalPrice: number
  paidAmount: number
  bills: {
    code: string
    type: string
    amount: number
    paidAmount: number
    status: 'Lunas' | 'Belum Bayar'
    dueDate: string
  }[]
}

const mockRegistrations: RegistrationItem[] = [
  {
    id: '1',
    code: 'REG-00001',
    pilgrimName: 'Ahmad Fauzi',
    passportNumber: 'B12345678',
    phone: '081234567890',
    packageName: 'Umroh Reguler 9 Hari',
    packageType: 'Umroh',
    status: 'Dikonfirmasi',
    paymentStatus: 'Sebagian',
    registeredAt: '05 Nov 2025',
    departureDate: '15 Nov 2026',
    branchName: 'Kantor Pusat Jakarta',
    guideName: 'Ustadz Muhammad Faisal, Lc.',
    agentName: 'Kantor Pusat',
    totalPrice: 28500000,
    paidAmount: 20666667,
    bills: [
      {
        code: 'REG-00001-DP',
        type: 'Uang Muka (DP)',
        amount: 5000000,
        paidAmount: 5000000,
        status: 'Lunas',
        dueDate: '07 Nov 2025',
      },
      {
        code: 'REG-00001-C1',
        type: 'Cicilan 1',
        amount: 7833333,
        paidAmount: 7833333,
        status: 'Lunas',
        dueDate: '05 Dec 2025',
      },
      {
        code: 'REG-00001-C2',
        type: 'Cicilan 2',
        amount: 7833333,
        paidAmount: 7833333,
        status: 'Lunas',
        dueDate: '05 Jan 2026',
      },
      {
        code: 'REG-00001-C3',
        type: 'Cicilan 3',
        amount: 7833333,
        paidAmount: 0,
        status: 'Belum Bayar',
        dueDate: '05 Feb 2026',
      },
    ],
  },
]

export default function JamaahPendaftaranPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [packageFilter, setPackageFilter] = useState('')
  const [selectedDetail, setSelectedDetail] = useState<RegistrationItem | null>(null)

  const filteredRegistrations = mockRegistrations.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false
    if (packageFilter && r.packageName !== packageFilter) return false
    return true
  })

  const formatRupiah = (num: number) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID')
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumb matching Laravel Blade */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/dashboard/jamaah" className="hover:text-gray-600 transition-colors">
          Beranda
        </Link>
        <ChevronRight size={13} className="text-gray-300" />
        <span className="text-gray-600 font-medium">Pendaftaran</span>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">Pendaftaran</h1>
        <p className="text-xs text-gray-500 mt-0.5">Booking jamaah ke paket Umroh &amp; Haji</p>
      </div>

      {/* Main Table Card matching Laravel <x-card class="mt-6" padding="p-0"> */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100 bg-white">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] bg-white cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Dikonfirmasi">Dikonfirmasi</option>
            <option value="Batal">Batal</option>
          </select>

          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] bg-white cursor-pointer"
          >
            <option value="">Semua Paket</option>
            <option value="Umroh Reguler 9 Hari">Umroh Reguler 9 Hari</option>
            <option value="Umroh Plus Turki 12 Hari">Umroh Plus Turki 12 Hari</option>
            <option value="Haji Khusus Furoda 2027">Haji Khusus Furoda 2027</option>
          </select>

          <button
            type="button"
            onClick={() => {}}
            className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Filter
          </button>
        </div>

        {/* Table matching Laravel <x-table :headers="['Kode', 'Jamaah', 'Paket', 'Status', 'Bayar', 'Tgl Daftar', '']"> */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold text-gray-500">KODE</th>
                <th className="py-3 px-4 font-semibold text-gray-500">JAMAAH</th>
                <th className="py-3 px-4 font-semibold text-gray-500">PAKET</th>
                <th className="py-3 px-4 font-semibold text-gray-500">STATUS</th>
                <th className="py-3 px-4 font-semibold text-gray-500">BAYAR</th>
                <th className="py-3 px-4 font-semibold text-gray-500">TGL DAFTAR</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                    Belum ada data pendaftaran yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-800 font-mono">{r.code}</td>
                    <td className="px-4 py-3.5 text-gray-800">{r.pilgrimName}</td>
                    <td className="px-4 py-3.5 text-gray-700">{r.packageName}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          r.paymentStatus === 'Lunas'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : r.paymentStatus === 'Sebagian'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{r.registeredAt}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedDetail(r)}
                        className="text-[#0d9488] font-medium text-sm hover:underline cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Detail Modal matching Laravel registrations/show.blade.php */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header info */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedDetail.pilgrimName}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedDetail.code}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {selectedDetail.status}
              </span>
            </div>

            {/* 3 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <span className="text-xs text-blue-600 font-medium">Total Tagihan</span>
                <p className="text-lg font-bold text-blue-900 mt-1">{formatRupiah(selectedDetail.totalPrice)}</p>
              </div>
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                <span className="text-xs text-emerald-600 font-medium">Sudah Dibayar</span>
                <p className="text-lg font-bold text-emerald-900 mt-1">{formatRupiah(selectedDetail.paidAmount)}</p>
              </div>
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-600 font-medium">Sisa Tagihan</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                    {selectedDetail.paymentStatus}
                  </span>
                </div>
                <p className="text-lg font-bold text-amber-900 mt-1">
                  {formatRupiah(selectedDetail.totalPrice - selectedDetail.paidAmount)}
                </p>
              </div>
            </div>

            {/* 2 Detail Column Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Card 1: Informasi Pendaftaran */}
              <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/40 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Informasi Pendaftaran
                </h4>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Tanggal Daftar:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.registeredAt}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Harga Paket:</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(selectedDetail.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Kantor Cabang:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.branchName}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Pembimbing (Muthawif):</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.guideName}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">Agen Travel:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.agentName}</span>
                </div>
              </div>

              {/* Card 2: Jamaah & Paket */}
              <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/40 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Jamaah &amp; Paket
                </h4>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nama Jamaah:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.pilgrimName}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">No. Paspor:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedDetail.passportNumber}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nomor Telepon:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.phone}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Paket Terpilih:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.packageName}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">Tanggal Keberangkatan:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.departureDate}</span>
                </div>
              </div>
            </div>

            {/* Tagihan & Pembayaran Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Rincian Tagihan &amp; Pembayaran
                </h4>
                <Link
                  href="/dashboard/jamaah/pembayaran"
                  className="text-xs font-semibold text-[#0d9488] hover:underline flex items-center gap-1"
                >
                  Kelola Pembayaran &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-semibold">
                      <th className="py-2.5 px-3">Kode</th>
                      <th className="py-2.5 px-3">Jenis</th>
                      <th className="py-2.5 px-3">Tagihan</th>
                      <th className="py-2.5 px-3">Dibayar</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Jatuh Tempo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedDetail.bills.map((b) => (
                      <tr key={b.code}>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{b.code}</td>
                        <td className="py-2.5 px-3">{b.type}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{formatRupiah(b.amount)}</td>
                        <td className="py-2.5 px-3 text-emerald-600 font-medium">{formatRupiah(b.paidAmount)}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              b.status === 'Lunas'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{b.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                href="/dashboard/jamaah/pembayaran"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EE4D2D] to-[#FF6B35] text-white text-xs font-bold shadow-xs hover:opacity-95 transition flex items-center gap-1.5"
              >
                <CreditCard size={14} />
                Bayar Tagihan Sekarang
              </Link>

              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
