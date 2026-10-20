'use client'

import React from 'react'
import { Printer, X } from 'lucide-react'
import { currency, terbilang, formatDate, formatDateTime } from '@/lib/helpers'

export interface KwitansiData {
  no_kuitansi: string
  tanggal: string
  jamaah: string
  jenis?: string
  paket: string
  no_pendaftaran: string
  metode: string
  via_bank?: string
  jumlah: number
  total_tagihan?: number
  sisa_tagihan?: number
  penerima?: string
}

export interface ManifestData {
  paket_nama: string
  paket_kode: string
  tipe: string
  tanggal_berangkat: string
  durasi_hari: number
  maskapai: string
  hotel_makkah: string
  hotel_madinah: string
  jamaah_list: {
    nama: string
    gender: 'L' | 'P'
    paspor: string
    kamar?: string
    tipe_kamar?: string
    bus?: string
    kursi?: string
    mahram?: string
  }[]
}

export interface PilgrimCardData {
  nama: string
  tipe_paket: string
  no_pendaftaran: string
  paket: string
  tanggal_berangkat: string
  no_paspor: string
  maskapai: string
  telepon: string
  kontak_darurat_nama: string
  kontak_darurat_telepon: string
}

const branding = {
  name: 'Travel Umroh & Haji',
  subtitle: 'Sistem Manajemen Umroh & Haji Terpadu',
  address: 'Jl. Sudirman No. 45, Jakarta Pusat',
  phone: '0812-3456-7890',
  email: 'info@travelumroh.com',
  color: '#0d9488',
}

export function KwitansiModal({
  data,
  onClose,
}: {
  data: KwitansiData
  onClose: () => void
}) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-2xl overflow-hidden print:border-none print:shadow-none print:max-w-none print:rounded-none">
        {/* Top Controls (Hidden in Print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 print:hidden">
          <span className="text-xs font-bold text-slate-700">Pratinjau Kwitansi Pembayaran</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-colors shadow-xs cursor-pointer"
            >
              <Printer size={14} />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 font-sans text-slate-800 text-[12px] bg-white print:p-6 print:text-[11px]">
          {/* Header */}
          <div className="border-b-2 pb-2 mb-3 border-[#0d9488]">
            <h1 className="text-lg font-bold text-[#0d9488] m-0 leading-tight">{branding.name}</h1>
            <p className="text-[10px] text-slate-500 m-0">{branding.subtitle}</p>
            <p className="text-[10px] text-slate-400 m-0">
              {branding.address} · {branding.phone} · {branding.email}
            </p>
          </div>

          <div className="text-center font-bold tracking-widest text-sm my-4 text-slate-900 uppercase">
            KWITANSI PEMBAYARAN
          </div>

          <table className="w-full border-collapse mb-4 text-xs">
            <tbody>
              <tr>
                <td className="w-28 py-1 text-slate-500">No. Kwitansi</td>
                <td className="py-1 font-mono font-bold text-slate-800">: {data.no_kuitansi}</td>
                <td className="w-28 py-1 text-slate-500">Tanggal</td>
                <td className="py-1 text-slate-800">: {formatDate(data.tanggal)}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Diterima dari</td>
                <td className="py-1 font-semibold text-slate-900">: {data.jamaah}</td>
                <td className="py-1 text-slate-500">Jenis</td>
                <td className="py-1">: <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">{data.jenis || 'Cicilan / Pelunasan'}</span></td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Paket</td>
                <td className="py-1 text-slate-800">: {data.paket}</td>
                <td className="py-1 text-slate-500">No. Pendaftaran</td>
                <td className="py-1 font-mono text-slate-800">: {data.no_pendaftaran}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Metode</td>
                <td className="py-1 text-slate-800">: {data.metode}</td>
                <td className="py-1 text-slate-500">Via Bank</td>
                <td className="py-1 text-slate-800">: {data.via_bank || 'Bank Syariah Indonesia (BSI)'}</td>
              </tr>
            </tbody>
          </table>

          {/* Amount Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-4">
            <span className="text-[11px] text-slate-500 block">Jumlah Dibayar:</span>
            <span className="text-2xl font-extrabold text-[#0d9488] block my-1">
              {currency(data.jumlah)}
            </span>
            <div className="text-[11px] italic text-slate-600 mt-1">
              Terbilang: {terbilang(data.jumlah)}
            </div>
          </div>

          <table className="w-full border-collapse my-3 text-xs">
            <tbody>
              <tr>
                <td className="w-32 py-1 text-slate-500">Total Tagihan Paket</td>
                <td className="py-1 font-semibold text-slate-800">: {currency(data.total_tagihan || 28500000)}</td>
                <td className="w-28 py-1 text-slate-500">Sisa Tagihan</td>
                <td className="py-1 font-semibold text-red-600">: {currency(data.sisa_tagihan ?? 0)}</td>
              </tr>
            </tbody>
          </table>

          {/* Signature Block */}
          <div className="mt-8 flex justify-end text-center text-xs">
            <div className="w-48">
              <p className="text-slate-500">Penerima,</p>
              <div className="h-14"></div>
              <p className="font-bold text-slate-800 border-t border-slate-300 pt-1">
                ( {data.penerima || 'Staf Kasir Travel'} )
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ManifestModal({
  data,
  onClose,
}: {
  data: ManifestData
  onClose: () => void
}) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-4xl overflow-hidden print:border-none print:shadow-none print:max-w-none print:rounded-none max-h-[90vh] flex flex-col">
        {/* Top Controls (Hidden in Print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 print:hidden flex-shrink-0">
          <span className="text-xs font-bold text-slate-700">Pratinjau Manifest Jamaah & Rooming</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-colors shadow-xs cursor-pointer"
            >
              <Printer size={14} />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Paper */}
        <div className="p-8 font-sans text-slate-800 text-[11px] bg-white overflow-y-auto print:p-4 print:text-[10px]">
          {/* Header */}
          <div className="border-b-2 pb-2 mb-3 border-[#0d9488]">
            <h1 className="text-base font-bold text-[#0d9488] m-0">{branding.name}</h1>
            <p className="text-[10px] text-slate-500 m-0">{branding.address} · {branding.phone}</p>
          </div>

          <div className="text-center font-bold tracking-widest text-sm my-3 text-slate-900 uppercase">
            MANIFEST JAMAAH
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs mb-4">
            <strong className="text-[#0d9488]">{data.paket_nama}</strong> ({data.paket_kode}) · {data.tipe} · Berangkat {formatDate(data.tanggal_berangkat)} · {data.durasi_hari} hari · Maskapai {data.maskapai}
            <div className="text-slate-500 mt-1">
              Hotel Mekah: {data.hotel_makkah} · Hotel Madinah: {data.hotel_madinah}
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-200 text-xs text-left">
            <thead>
              <tr className="bg-slate-100 text-[10px] text-slate-600 uppercase">
                <th className="border border-slate-200 p-2 w-8 text-center">No</th>
                <th className="border border-slate-200 p-2">Nama Jamaah</th>
                <th className="border border-slate-200 p-2 w-10 text-center">L/P</th>
                <th className="border border-slate-200 p-2">No. Paspor</th>
                <th className="border border-slate-200 p-2">Kamar</th>
                <th className="border border-slate-200 p-2">Tipe</th>
                <th className="border border-slate-200 p-2">Bus</th>
                <th className="border border-slate-200 p-2">Kursi</th>
                <th className="border border-slate-200 p-2">Mahram/Grup</th>
              </tr>
            </thead>
            <tbody>
              {data.jamaah_list.map((j, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="border border-slate-200 p-2 text-center">{i + 1}</td>
                  <td className="border border-slate-200 p-2 font-semibold text-slate-800">{j.nama}</td>
                  <td className="border border-slate-200 p-2 text-center">{j.gender}</td>
                  <td className="border border-slate-200 p-2 font-mono">{j.paspor}</td>
                  <td className="border border-slate-200 p-2">{j.kamar || '-'}</td>
                  <td className="border border-slate-200 p-2">{j.tipe_kamar || 'Quad'}</td>
                  <td className="border border-slate-200 p-2">{j.bus || 'Bus 1'}</td>
                  <td className="border border-slate-200 p-2">{j.kursi || '-'}</td>
                  <td className="border border-slate-200 p-2">{j.mahram || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
            <span>Total jamaah aktif: {data.jamaah_list.length}</span>
            <span>Dicetak {formatDateTime(new Date())}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PilgrimCardModal({
  data,
  onClose,
}: {
  data: PilgrimCardData
  onClose: () => void
}) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-sm overflow-hidden print:border-none print:shadow-none print:max-w-none print:rounded-none">
        {/* Top Controls (Hidden in Print) */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/50 print:hidden">
          <span className="text-xs font-bold text-slate-700">Kartu Tanda Jamaah</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-colors shadow-xs cursor-pointer"
            >
              <Printer size={13} />
              <span>Cetak Kartu</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Card Paper (ID Card Size 85mm x 54mm standard) */}
        <div className="p-6 font-sans text-slate-800 bg-white">
          <div className="border border-slate-300 rounded-2xl p-5 shadow-sm bg-gradient-to-br from-white to-slate-50">
            <div className="border-b-2 pb-2 mb-3 border-[#0d9488] flex items-center justify-between">
              <div>
                <h1 className="text-xs font-extrabold text-[#0d9488] m-0">{branding.name}</h1>
                <p className="text-[9px] text-slate-400 m-0">KARTU JAMAAH · {branding.phone}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-[#0d9488]">
                {data.tipe_paket || 'Umroh'}
              </span>
            </div>

            <div className="text-base font-bold text-slate-900 mb-2">
              {data.nama}
            </div>

            <table className="w-full border-collapse text-[11px] text-slate-600">
              <tbody>
                <tr>
                  <td className="w-20 py-0.5 text-slate-400">No. Daftar</td>
                  <td className="py-0.5 font-bold font-mono text-slate-800">: {data.no_pendaftaran}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-slate-400">Paket</td>
                  <td className="py-0.5 font-medium text-slate-800">: {data.paket}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-slate-400">Berangkat</td>
                  <td className="py-0.5 text-slate-800">: {formatDate(data.tanggal_berangkat)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-slate-400">No. Paspor</td>
                  <td className="py-0.5 font-mono text-slate-800">: {data.no_paspor || '-'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-slate-400">Maskapai</td>
                  <td className="py-0.5 text-slate-800">: {data.maskapai || 'Saudia Airlines'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-slate-400">Kontak</td>
                  <td className="py-0.5 text-slate-800">: {data.telepon || '-'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-slate-400">Darurat</td>
                  <td className="py-0.5 text-slate-800">: {data.kontak_darurat_nama} ({data.kontak_darurat_telepon})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
