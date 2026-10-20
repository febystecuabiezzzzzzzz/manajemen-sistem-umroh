'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface DocItem {
  id: string
  nama: string
  status: 'Terverifikasi' | 'Sudah Diunggah' | 'Belum Diunggah'
  catatan: string
}

const initialDocs: DocItem[] = [
  { id: '1', nama: 'KTP (Kartu Tanda Penduduk)', status: 'Terverifikasi', catatan: 'Scan KTP jelas & valid' },
  { id: '2', nama: 'Kartu Keluarga (KK)', status: 'Sudah Diunggah', catatan: 'Sedang diverifikasi tim operasional' },
  { id: '3', nama: 'Paspor Asli (Min. 8 Bulan Berlaku)', status: 'Belum Diunggah', catatan: 'Wajib diunggah maksimal H-45 keberangkatan' },
  { id: '4', nama: 'Pas Foto 4x6 Latar Putih', status: 'Terverifikasi', catatan: 'Fokus wajah 80%' },
  { id: '5', nama: 'Buku Nikah / Akta Lahir', status: 'Terverifikasi', catatan: 'Berkas lengkap' },
  { id: '6', nama: 'Sertifikat Vaksin Meningitis', status: 'Sudah Diunggah', catatan: 'Menunggu validasi' },
]

export default function JamaahDokumenPage() {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs)
  const { showToast } = useToast()

  const handleUploadMock = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Sudah Diunggah', catatan: 'Berkas berhasil diunggah' } : d))
    )
    showToast('Dokumen berhasil diunggah! Tim akan segera memverifikasi.', 'success')
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/jamaah" className="hover:text-slate-600">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Dokumen Saya</span>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Kelengkapan Berkas & Dokumen</h1>
        <p className="text-xs text-slate-400 mt-0.5">Unggah dokumen persyaratan visa dan cek status verifikasi</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
        {docs.map((doc) => (
          <div key={doc.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-[#0d9488]" />
                <span className="text-sm font-bold text-slate-800">{doc.nama}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  doc.status === 'Terverifikasi'
                    ? 'bg-emerald-50 text-emerald-600'
                    : doc.status === 'Sudah Diunggah'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {doc.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 pl-6.5">{doc.catatan}</p>
            </div>

            <button
              type="button"
              onClick={() => handleUploadMock(doc.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#0f766e] bg-white text-xs font-semibold text-slate-700 hover:text-[#0f766e] transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
            >
              <Upload size={13} />
              <span>{doc.status === 'Belum Diunggah' ? 'Unggah Berkas' : 'Unggah Ulang'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
