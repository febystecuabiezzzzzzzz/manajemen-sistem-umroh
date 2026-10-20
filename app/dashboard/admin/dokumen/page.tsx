'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  FileCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Loader2,
  X,
  Plus,
  Download,
  Upload,
  Check,
  FileText
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'

interface DocumentItem {
  id: string
  label: string
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
  file_name?: string
  verified_at?: string
  note?: string
}

interface PilgrimDocRecord {
  id: string
  code: string
  name: string
  branch: string
  visa_status: 'Issued' | 'Dalam Proses' | 'Belum Diajukan'
  documents: DocumentItem[]
}

const defaultDocsTemplate: { label: string; note: string }[] = [
  { label: 'Paspor Asli (Min. 8 Bulan Berlaku)', note: 'Pastikan 3 suku kata nama dan masa berlaku mencukupi' },
  { label: 'KTP (Kartu Tanda Penduduk)', note: 'Scan e-KTP jelas & tidak buram' },
  { label: 'Kartu Keluarga (KK)', note: 'Wajib untuk pendaftaran keluarga / mahram' },
  { label: 'Buku Nikah / Akta Lahir', note: 'Bagi pasangan suami-istri atau anak' },
  { label: 'Sertifikat Vaksin Meningitis', note: 'Buku kuning ICV atau sertifikat SatuSehat' },
  { label: 'Pas Foto 4x6 Latar Putih', note: 'Fokus wajah 80%, pakaian kontras' },
]

const initialPilgrims: PilgrimDocRecord[] = [
  {
    id: '1',
    code: 'PLG-2026-001',
    name: 'H. Ahmad Dahlan',
    branch: 'Cabang Jakarta Pusat',
    visa_status: 'Issued',
    documents: [
      { id: 'd1', label: 'Paspor Asli (Min. 8 Bulan Berlaku)', status: 'verified', file_name: 'paspor_ahmad.pdf', verified_at: '12 Okt 2026' },
      { id: 'd2', label: 'KTP (Kartu Tanda Penduduk)', status: 'verified', file_name: 'ktp_ahmad.jpg', verified_at: '12 Okt 2026' },
      { id: 'd3', label: 'Kartu Keluarga (KK)', status: 'verified', file_name: 'kk_ahmad.pdf', verified_at: '12 Okt 2026' },
      { id: 'd4', label: 'Buku Nikah / Akta Lahir', status: 'verified', file_name: 'buku_nikah.pdf', verified_at: '13 Okt 2026' },
      { id: 'd5', label: 'Sertifikat Vaksin Meningitis', status: 'verified', file_name: 'vaksin_ahmad.pdf', verified_at: '14 Okt 2026' },
      { id: 'd6', label: 'Pas Foto 4x6 Latar Putih', status: 'verified', file_name: 'foto_ahmad.jpg', verified_at: '14 Okt 2026' },
    ],
  },
  {
    id: '2',
    code: 'PLG-2026-002',
    name: 'Hj. Siti Aisyah',
    branch: 'Cabang Jakarta Pusat',
    visa_status: 'Dalam Proses',
    documents: [
      { id: 'd7', label: 'Paspor Asli (Min. 8 Bulan Berlaku)', status: 'uploaded', file_name: 'paspor_siti.pdf', note: 'Menunggu review nama 3 kata' },
      { id: 'd8', label: 'KTP (Kartu Tanda Penduduk)', status: 'verified', file_name: 'ktp_siti.jpg', verified_at: '10 Okt 2026' },
      { id: 'd9', label: 'Kartu Keluarga (KK)', status: 'verified', file_name: 'kk_siti.pdf', verified_at: '10 Okt 2026' },
      { id: 'd10', label: 'Sertifikat Vaksin Meningitis', status: 'pending', note: 'Jadwal suntik tanggal 20 Okt' },
      { id: 'd11', label: 'Pas Foto 4x6 Latar Putih', status: 'uploaded', file_name: 'foto_siti.jpg' },
    ],
  },
  {
    id: '3',
    code: 'PLG-2026-003',
    name: 'Bambang Sudarmono',
    branch: 'Cabang Surabaya',
    visa_status: 'Belum Diajukan',
    documents: [
      { id: 'd12', label: 'Paspor Asli (Min. 8 Bulan Berlaku)', status: 'pending', note: 'Sedang proses perpanjangan di imigrasi' },
      { id: 'd13', label: 'KTP (Kartu Tanda Penduduk)', status: 'verified', file_name: 'ktp_bambang.jpg', verified_at: '08 Okt 2026' },
      { id: 'd14', label: 'Kartu Keluarga (KK)', status: 'uploaded', file_name: 'kk_bambang.pdf' },
      { id: 'd15', label: 'Sertifikat Vaksin Meningitis', status: 'pending' },
      { id: 'd16', label: 'Pas Foto 4x6 Latar Putih', status: 'rejected', file_name: 'foto_buram.jpg', note: 'Foto buram dan latar belakang biru (harus putih)' },
    ],
  },
  {
    id: '4',
    code: 'PLG-2026-004',
    name: 'Nurul Hidayati',
    branch: 'Cabang Bandung',
    visa_status: 'Belum Diajukan',
    documents: [],
  },
]

export default function DokumenPage() {
  const [pilgrims, setPilgrims] = useState<PilgrimDocRecord[]>(initialPilgrims)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedPilgrim, setSelectedPilgrim] = useState<PilgrimDocRecord | null>(null)
  const { showToast } = useToast()

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dokumen')
      const json = await res.json()
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Map backend flat records if present, or enrich with template
        const enriched = json.data.map((row: any, idx: number) => ({
          id: String(row.id || idx + 1),
          code: `PLG-2026-${String(idx + 1).padStart(3, '0')}`,
          name: row.jamaah || row.name || 'Jamaah',
          branch: 'Kantor Pusat',
          visa_status: (row.visa || 'Dalam Proses') as any,
          documents: [
            { id: `doc-1-${idx}`, label: 'Paspor Asli', status: row.paspor === 'Lengkap' ? 'verified' : row.paspor === 'Proses' ? 'uploaded' : 'pending', file_name: row.paspor === 'Lengkap' ? 'paspor.pdf' : undefined },
            { id: `doc-2-${idx}`, label: 'KTP', status: row.ktp === 'Lengkap' ? 'verified' : 'pending', file_name: row.ktp === 'Lengkap' ? 'ktp.jpg' : undefined },
            { id: `doc-3-${idx}`, label: 'Kartu Keluarga', status: row.buku_nikah === 'Lengkap' ? 'verified' : 'pending', file_name: row.buku_nikah === 'Lengkap' ? 'kk.pdf' : undefined },
            { id: `doc-4-${idx}`, label: 'Vaksin Meningitis', status: row.vaksin === 'Lengkap' ? 'verified' : row.vaksin === 'Proses' ? 'uploaded' : 'pending' },
            { id: `doc-5-${idx}`, label: 'Pas Foto 4x6', status: row.foto === 'Lengkap' ? 'verified' : 'pending', file_name: row.foto === 'Lengkap' ? 'foto.jpg' : undefined },
          ],
        }))
        setPilgrims(enriched)
      }
    } catch {
      // Keep initial local data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSeedStandardChecklist = (pilgrimId: string) => {
    const newDocs: DocumentItem[] = defaultDocsTemplate.map((tpl, i) => ({
      id: `doc-gen-${Date.now()}-${i}`,
      label: tpl.label,
      status: 'pending',
      note: tpl.note,
    }))

    setPilgrims((prev) =>
      prev.map((p) => {
        if (p.id === pilgrimId) {
          const updated = { ...p, documents: newDocs }
          if (selectedPilgrim?.id === pilgrimId) setSelectedPilgrim(updated)
          return updated
        }
        return p
      })
    )
    showToast('Checklist standar berhasil dibuat untuk jamaah!', 'success')
  }

  const handleUpdateDocStatus = (
    pilgrimId: string,
    docId: string,
    newStatus: DocumentItem['status']
  ) => {
    setPilgrims((prev) =>
      prev.map((p) => {
        if (p.id === pilgrimId) {
          const updatedDocs = p.documents.map((d) =>
            d.id === docId
              ? {
                  ...d,
                  status: newStatus,
                  verified_at: newStatus === 'verified' ? 'Hari ini' : d.verified_at,
                }
              : d
          )
          const updatedPilgrim = { ...p, documents: updatedDocs }
          if (selectedPilgrim?.id === pilgrimId) setSelectedPilgrim(updatedPilgrim)
          return updatedPilgrim
        }
        return p
      })
    )
    showToast(`Status dokumen diubah menjadi: ${newStatus.toUpperCase()}`, 'success')
  }

  const handleToggleVisa = (pilgrimId: string) => {
    setPilgrims((prev) =>
      prev.map((p) => {
        if (p.id === pilgrimId) {
          const nextVisa: PilgrimDocRecord['visa_status'] =
            p.visa_status === 'Issued'
              ? 'Dalam Proses'
              : p.visa_status === 'Dalam Proses'
              ? 'Belum Diajukan'
              : 'Issued'
          const updated: PilgrimDocRecord = { ...p, visa_status: nextVisa }
          if (selectedPilgrim?.id === pilgrimId) setSelectedPilgrim(updated)
          return updated
        }
        return p
      })
    )
    showToast('Status visa berhasil diperbarui!', 'success')
  }

  const filtered = pilgrims.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700"><CheckCircle2 size={11} /> Terverifikasi</span>
      case 'uploaded':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700"><Clock size={11} /> Diunggah</span>
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700"><XCircle size={11} /> Ditolak</span>
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500"><Clock size={11} /> Menunggu</span>
    }
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dokumen' }]} />

      <PageHeader
        title="Dokumen Jamaah"
        subtitle="Kelengkapan & verifikasi dokumen per jamaah"
      />

      <Card className="mt-6" padding="p-0">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Cari nama jamaah atau kode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none max-w-sm w-full"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Memuat data dokumen...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Belum ada dokumen"
            message="Data dokumen jamaah akan tampil di sini setelah ditambahkan."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    JAMAAH
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    CABANG
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-52">
                    KELENGKAPAN
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    STATUS VISA
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map((p) => {
                  const total = p.documents.length
                  const verifiedCount = p.documents.filter((d) => d.status === 'verified').length
                  const pct = total > 0 ? Math.round((verifiedCount / total) * 100) : 0

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-slate-800">{p.name}</p>
                        <p className="text-[11px] text-slate-400">{p.code}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{p.branch}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#0d9488] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 shrink-0">
                            {verifiedCount}/{total}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {total === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            Belum Ada
                          </span>
                        ) : pct >= 100 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            Lengkap
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
                            Proses
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.visa_status === 'Issued'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.visa_status === 'Dalam Proses'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.visa_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleToggleVisa(p.id)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                        >
                          Visa
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPilgrim(p)}
                          className="px-3 py-1 text-[11px] font-semibold text-[#0d9488] hover:text-white bg-teal-50 hover:bg-[#0d9488] rounded-md transition-colors cursor-pointer"
                        >
                          Kelola
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MODAL KELOLA DOKUMEN (Mirip Laravel documents/show.blade.php) */}
      {selectedPilgrim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-800">Dokumen — {selectedPilgrim.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Kode: {selectedPilgrim.code} • {selectedPilgrim.branch}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedPilgrim.documents.length === 0 && (
                  <button
                    type="button"
                    onClick={() => handleSeedStandardChecklist(selectedPilgrim.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0d9488] text-white hover:bg-[#0f766e] transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    Buat Checklist Standar
                  </button>
                )}
                <button
                  onClick={() => setSelectedPilgrim(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {selectedPilgrim.documents.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Checklist masih kosong</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Klik tombol “Buat Checklist Standar” untuk membuat daftar dokumen wajib jamaah secara otomatis.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSeedStandardChecklist(selectedPilgrim.id)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#0d9488] text-white hover:bg-[#0f766e] cursor-pointer"
                  >
                    <Plus size={14} />
                    Buat Checklist Standar
                  </button>
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                        <th className="py-2.5 px-4">DOKUMEN</th>
                        <th className="py-2.5 px-3">STATUS</th>
                        <th className="py-2.5 px-3">BERKAS</th>
                        <th className="py-2.5 px-4 text-right">AKSI VERIFIKASI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPilgrim.documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-800">{doc.label}</p>
                            {doc.note && <p className="text-[10px] text-slate-400 mt-0.5">{doc.note}</p>}
                          </td>
                          <td className="py-3 px-3">
                            {getStatusBadge(doc.status)}
                            {doc.verified_at && (
                              <p className="text-[10px] text-slate-400 mt-0.5">{doc.verified_at}</p>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {doc.file_name ? (
                              <span className="inline-flex items-center gap-1 text-[#0d9488] font-medium hover:underline cursor-pointer">
                                <Download size={12} />
                                {doc.file_name}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Belum diunggah</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <select
                                value={doc.status}
                                onChange={(e) =>
                                  handleUpdateDocStatus(
                                    selectedPilgrim.id,
                                    doc.id,
                                    e.target.value as any
                                  )
                                }
                                className="px-2 py-1 rounded border border-slate-200 text-[11px] text-slate-700 bg-white focus:outline-none focus:border-[#0d9488] cursor-pointer"
                              >
                                <option value="pending">Menunggu</option>
                                <option value="uploaded">Diunggah</option>
                                <option value="verified">Terverifikasi</option>
                                <option value="rejected">Ditolak</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Total dokumen: {selectedPilgrim.documents.length} • Terverifikasi:{' '}
                {selectedPilgrim.documents.filter((d) => d.status === 'verified').length}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPilgrim(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
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
