'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Database,
  Play,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Table as TableIcon,
  Layers,
  Code2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Server,
  Zap,
  RefreshCw,
  Save,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { FULL_SCHEMA_SQL, SEED_DATA_SQL, SQL_SNIPPETS, SqlSnippet } from '@/lib/sql-templates'

const SYSTEM_TABLES = [
  { name: 'cabang', desc: 'Daftar kantor cabang & pusat' },
  { name: 'paket', desc: 'Paket Umroh & Haji beserta kuota' },
  { name: 'hotel', desc: 'Hotel Makkah, Madinah, Jeddah' },
  { name: 'maskapai', desc: 'Maskapai penerbangan & rute' },
  { name: 'rekening', desc: 'Rekening bank travel' },
  { name: 'agen', desc: 'Mitra agen & perhitungan komisi' },
  { name: 'muthawif', desc: 'Ustadz pembimbing & muthawif' },
  { name: 'jamaah', desc: 'Biodata & data paspor jamaah' },
  { name: 'pendaftaran', desc: 'Data registrasi & status pembayaran' },
  { name: 'pembayaran', desc: 'Riwayat transaksi & bukti transfer' },
  { name: 'dokumen_jamaah', desc: 'Berkas paspor, KTP, buku nikah' },
  { name: 'manasik', desc: 'Jadwal bimbingan manasik' },
  { name: 'pengumuman', desc: 'Informasi pengumuman jamaah' },
  { name: 'profiles', desc: 'Akun user & hak akses role' },
  { name: 'activity_logs', desc: 'Log aktivitas sistem' },
]

export default function SqlEditorPage() {
  const { showToast } = useToast()

  // State Editor
  const [sqlQuery, setSqlQuery] = useState<string>(FULL_SCHEMA_SQL)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState<'table' | 'json' | 'log'>('table')
  const [copiedQuery, setCopiedQuery] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  // State Hasil Query
  const [queryResult, setQueryResult] = useState<{
    success: boolean
    fields?: string[]
    rows?: any[]
    rowCount?: number
    executionTimeMs?: number
    command?: string
    message?: string
    error?: string
    hint?: string
    needDirectConnection?: boolean
  } | null>(null)

  // State Koneksi
  const [isTestingConn, setIsTestingConn] = useState(false)
  const [isSavingConn, setIsSavingConn] = useState(false)
  const [dbPassword, setDbPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [customConnString, setCustomConnString] = useState('')
  const [connStatus, setConnStatus] = useState<{
    restConnected: boolean
    pgConnected: boolean
    restMessage?: string
    pgMessage?: string
    projectRef?: string
    supabaseUrl?: string
    detectedTables: string[]
    hasEnvDatabaseUrl: boolean
  }>({
    restConnected: false,
    pgConnected: false,
    detectedTables: [],
    hasEnvDatabaseUrl: false,
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Test koneksi saat pertama kali load
  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setIsTestingConn(true)
    try {
      const res = await fetch('/api/sql-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-connection',
          connectionString: customConnString,
          dbPassword: dbPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setConnStatus({
          restConnected: data.restConnected,
          pgConnected: data.pgConnected,
          restMessage: data.restMessage,
          pgMessage: data.pgMessage,
          projectRef: data.projectRef,
          supabaseUrl: data.supabaseUrl,
          detectedTables: data.detectedTables || [],
          hasEnvDatabaseUrl: data.hasEnvDatabaseUrl,
        })
      }
    } catch {
      showToast('Gagal menghubungi server untuk cek koneksi.', 'error')
    } finally {
      setIsTestingConn(false)
    }
  }

  const handleSaveConnection = async () => {
    if (!customConnString && !dbPassword) {
      showToast('Silakan masukkan Database Password atau Connection String terlebih dahulu.', 'error')
      return
    }

    setIsSavingConn(true)
    try {
      const res = await fetch('/api/sql-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-connection',
          connectionString: customConnString,
          dbPassword: dbPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(data.message || 'DATABASE_URL berhasil disimpan!', 'success')
        testConnection()
      } else {
        showToast(data.error || 'Gagal menyimpan koneksi.', 'error')
      }
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan saat menyimpan.', 'error')
    } finally {
      setIsSavingConn(false)
    }
  }

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      showToast('Masukkan query SQL yang ingin dijalankan.', 'error')
      return
    }

    setIsExecuting(true)
    setQueryResult(null)

    try {
      const res = await fetch('/api/sql-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          query: sqlQuery,
          connectionString: customConnString,
          dbPassword: dbPassword,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setQueryResult(data)
        showToast(`Query berhasil dijalankan (${data.executionTimeMs}ms)`, 'success')
        if (data.rows && data.rows.length > 0) {
          setActiveTab('table')
        } else {
          setActiveTab('log')
        }
        // Refresh tabel terdeteksi
        testConnection()
      } else {
        setQueryResult(data)
        setActiveTab('log')
        showToast(data.error || 'Eksekusi query gagal.', 'error')
      }
    } catch (err: any) {
      setQueryResult({
        success: false,
        error: err.message || 'Terjadi kesalahan server saat mengeksekusi query.',
      })
      setActiveTab('log')
      showToast('Koneksi terputus atau query timeout.', 'error')
    } finally {
      setIsExecuting(false)
    }
  }

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlQuery)
    setCopiedQuery(true)
    showToast('Query SQL berhasil disalin ke clipboard!', 'success')
    setTimeout(() => setCopiedQuery(false), 2000)
  }

  const handleSelectSnippet = (snippet: SqlSnippet) => {
    setSqlQuery(snippet.sql)
    showToast(`Memuat template: ${snippet.title}`, 'info')
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.scrollTop = 0
    }
  }

  const handleQueryTable = (tableName: string) => {
    const query = `SELECT * FROM public.${tableName} LIMIT 25;`
    setSqlQuery(query)
    showToast(`Query SELECT ${tableName} dimuat ke editor`, 'info')
  }

  // Hotkey Ctrl + Enter untuk eksekusi
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleExecuteQuery()
    }
  }

  const supabaseRef = connStatus.projectRef || 'xwqxoidpcfpbqllwccgc'
  const supabaseSqlUrl = `https://supabase.com/dashboard/project/${supabaseRef}/sql/new`

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/admin" className="hover:text-slate-600 transition-colors">
          Beranda
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">SQL Editor & Supabase</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Database size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">SQL Editor & Supabase Manager</h1>
              <p className="text-xs text-slate-500">
                Kelola skema tabel, isi database data travel umroh, dan hubungkan aplikasi ke Supabase
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              showConfig
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <KeyRound size={14} />
            <span>{showConfig ? 'Tutup Pengaturan' : 'Konfigurasi Koneksi'}</span>
          </button>

          <a
            href={supabaseSqlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
          >
            <span>Buka Supabase Studio</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* STATUS BAR SUPABASE */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-xs font-medium text-slate-700">
              <Server size={14} className="text-slate-500" />
              <span>Project Ref:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {supabaseRef}
              </span>
            </div>

            {/* Status REST */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                connStatus.restConnected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${connStatus.restConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>REST API: {connStatus.restConnected ? 'Aktif' : 'Cek Kunci'}</span>
            </div>

            {/* Status Postgres Direct */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                connStatus.pgConnected
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${connStatus.pgConnected ? 'bg-blue-500' : 'bg-slate-400'}`} />
              <span>PostgreSQL: {connStatus.pgConnected ? 'Terhubung (Direct)' : 'Belum Direct'}</span>
            </div>

            {/* Detected Tables Counter */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-lg text-xs font-medium text-purple-700">
              <Layers size={13} />
              <span>
                {connStatus.detectedTables.length > 0
                  ? `${connStatus.detectedTables.length} Tabel Aktif di Database`
                  : 'Tabel Belum Terdeteksi'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={testConnection}
              disabled={isTestingConn}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={isTestingConn ? 'animate-spin' : ''} />
              <span>{isTestingConn ? 'Memeriksa...' : 'Cek Status'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Connection Settings */}
        {showConfig && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <KeyRound size={14} className="text-emerald-600" />
                Input Database Password Supabase
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Untuk dapat mengeksekusi perintah DDL (<code>CREATE TABLE</code>, <code>ALTER</code>) langsung dari SQL Editor ini,
                masukkan password database Supabase project Anda:
              </p>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password database Supabase Anda..."
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={testConnection}
                  disabled={isTestingConn || !dbPassword}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isTestingConn ? 'Menguji...' : 'Uji Koneksi Password'}
                </button>
                <button
                  onClick={handleSaveConnection}
                  disabled={isSavingConn || !dbPassword}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50"
                >
                  <Save size={13} />
                  <span>{isSavingConn ? 'Menyimpan...' : 'Simpan ke .env.local'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-blue-600" />
                Cara Mendapatkan Password / Connection String:
              </h4>
              <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Buka dashboard <strong>Supabase</strong> Anda di browser.</li>
                <li>Pilih project: <strong className="font-mono text-emerald-700">{supabaseRef}</strong></li>
                <li>Masuk ke menu <strong>Project Settings &rarr; Database</strong></li>
                <li>Di bagian <strong>Connection string (URI)</strong>, salin format URI atau reset database password jika lupa.</li>
              </ol>
              <div className="pt-2 text-[11px] text-slate-400 italic">
                * Alternatif termudah: Anda cukup klik tombol <strong>Salin SQL</strong> di bawah, lalu paste di <strong>Supabase SQL Editor</strong> bawaan Supabase.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK STEP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          onClick={() => handleSelectSnippet(SQL_SNIPPETS[0])}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Zap size={18} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">Langkah 1</span>
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
            1. Buat Tabel (Full Migration)
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Muat skema tabel umroh (cabang, paket, hotel, jamaah, pembayaran, rls).
          </p>
        </div>

        <div
          onClick={() => handleSelectSnippet(SQL_SNIPPETS[1])}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Database size={18} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Langkah 2</span>
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
            2. Isi Data Awal (Seed Data)
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Populasikan data realistis cabang, paket reguler & haji, hotel, dan jamaah.
          </p>
        </div>

        <div
          onClick={() => handleSelectSnippet(SQL_SNIPPETS[2])}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TableIcon size={18} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">Langkah 3</span>
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
            3. Cek Status Tabel
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Periksa daftar tabel yang berhasil terbuat beserta jumlah datanya di PostgreSQL.
          </p>
        </div>
      </div>

      {/* WORKSPACE AREA: DUA KOLOM */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* KOLOM KIRI: EXPLORER TABEL & SNIPPETS */}
        <div className="lg:col-span-1 space-y-4">
          {/* Box Tabel Sistem */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <TableIcon size={13} className="text-emerald-600" />
                Tabel Sistem ({SYSTEM_TABLES.length})
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Klik tabel untuk menjalankan SELECT cepat:</p>
            <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
              {SYSTEM_TABLES.map((t) => {
                const isCreated = connStatus.detectedTables.includes(t.name)
                return (
                  <button
                    key={t.name}
                    onClick={() => handleQueryTable(t.name)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isCreated ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                      <span className="font-mono text-slate-700 font-medium group-hover:text-emerald-600 truncate">
                        {t.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      SELECT &rarr;
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Box Template SQL */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Code2 size={13} className="text-blue-600" />
                Template Query
              </span>
            </div>
            <div className="space-y-1.5">
              {SQL_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.id}
                  onClick={() => handleSelectSnippet(snippet)}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="font-semibold text-slate-800">{snippet.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{snippet.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: CODE EDITOR & RESULT VIEWER */}
        <div className="lg:col-span-3 space-y-4">
          {/* EDITOR CARD */}
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-md border border-slate-800">
            {/* Editor Toolbar */}
            <div className="bg-slate-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-300">
                  <Database size={13} className="text-emerald-400" />
                  SQL Query Editor
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  (Tekan Ctrl + Enter untuk jalankan)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                  title="Salin SQL ke Clipboard"
                >
                  {copiedQuery ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedQuery ? 'Tersalin' : 'Salin SQL'}</span>
                </button>

                <button
                  onClick={() => setSqlQuery('')}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  title="Bersihkan Editor"
                >
                  <RotateCcw size={13} />
                </button>

                <button
                  onClick={handleExecuteQuery}
                  disabled={isExecuting}
                  className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-md shadow-sm transition-all disabled:opacity-50"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Menjalankan...</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} className="fill-white" />
                      <span>Jalankan Query</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={12}
                placeholder="Tulis query SQL PostgreSQL di sini... Contoh: SELECT * FROM public.paket;"
                className="w-full bg-[#0b1120] text-emerald-300 font-mono text-xs leading-relaxed p-4 focus:outline-none resize-y selection:bg-emerald-500/30 border-none"
                spellCheck={false}
              />
            </div>
          </div>

          {/* STATUS / INFORMATIVE BANNER JIKA BUTUH DIRECT POSTGRES */}
          {queryResult?.needDirectConnection && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-950">
                    Eksekusi Script DDL Membutuhkan Koneksi Langsung atau Supabase Studio
                  </h4>
                  <p className="leading-relaxed text-amber-800">{queryResult.message}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={supabaseSqlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <span>1. Buka Supabase SQL Editor</span>
                  <ExternalLink size={12} />
                </a>
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold rounded-lg transition-colors"
                >
                  <Copy size={12} />
                  <span>2. Salin SQL Ini</span>
                </button>
                <button
                  onClick={() => setShowConfig(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold rounded-lg transition-colors"
                >
                  <KeyRound size={12} />
                  <span>3. Atau Masukkan Password DB</span>
                </button>
              </div>
            </div>
          )}

          {/* HASIL QUERY VIEWER */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Tab Headers */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('table')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'table'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tabel Data {queryResult?.rows ? `(${queryResult.rows.length})` : ''}
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'json'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Format JSON
                </button>
                <button
                  onClick={() => setActiveTab('log')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'log'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pesan & Log
                </button>
              </div>

              {queryResult && (
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  {queryResult.executionTimeMs !== undefined && (
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      ⏱️ {queryResult.executionTimeMs} ms
                    </span>
                  )}
                  {queryResult.rowCount !== undefined && (
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      📄 {queryResult.rowCount} baris
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Content Tab: TABEL DATA */}
            {activeTab === 'table' && (
              <div className="p-0 max-h-[420px] overflow-auto">
                {queryResult?.rows && queryResult.rows.length > 0 ? (
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100/80 sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 font-semibold text-slate-500 w-10 text-center font-mono">#</th>
                        {(queryResult.fields || Object.keys(queryResult.rows[0])).map((field) => (
                          <th key={field} className="py-2 px-3 font-bold text-slate-700 font-mono">
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {queryResult.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="py-2 px-3 text-slate-400 text-center">{idx + 1}</td>
                          {(queryResult.fields || Object.keys(queryResult.rows![0])).map((field) => {
                            const val = row[field]
                            let display = String(val)
                            let isNull = val === null || val === undefined

                            if (typeof val === 'boolean') {
                              display = val ? 'TRUE' : 'FALSE'
                            } else if (typeof val === 'object' && val !== null) {
                              display = JSON.stringify(val)
                            }

                            return (
                              <td key={field} className="py-2 px-3 text-slate-700 whitespace-nowrap max-w-xs truncate">
                                {isNull ? (
                                  <span className="text-slate-300 italic">null</span>
                                ) : typeof val === 'boolean' ? (
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      val ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                    }`}
                                  >
                                    {display}
                                  </span>
                                ) : (
                                  display
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <Database size={28} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-xs">
                      {queryResult?.message || 'Belum ada data query. Tulis query SQL di atas dan klik "Jalankan Query".'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Content Tab: JSON */}
            {activeTab === 'json' && (
              <div className="p-4 max-h-[420px] overflow-auto bg-slate-900 text-slate-200">
                {queryResult?.rows ? (
                  <pre className="font-mono text-xs leading-relaxed text-emerald-400">
                    {JSON.stringify(queryResult.rows, null, 2)}
                  </pre>
                ) : (
                  <p className="text-xs font-mono text-slate-400">// Tidak ada data JSON</p>
                )}
              </div>
            )}

            {/* Content Tab: LOG / PESAN */}
            {activeTab === 'log' && (
              <div className="p-4 space-y-3">
                {queryResult ? (
                  <>
                    {queryResult.success ? (
                      <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">Query Berhasil Dieksekusi</div>
                          <div>{queryResult.message || 'Perintah selesai tanpa error.'}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                        <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">Query Error:</div>
                          <div className="font-mono mt-1 text-[11px] bg-red-100/60 p-2 rounded">
                            {queryResult.error}
                          </div>
                          {queryResult.hint && (
                            <div className="mt-1 text-slate-600 italic">Petunjuk: {queryResult.hint}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-slate-400 italic">Belum ada aktivitas query dijalankan.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
