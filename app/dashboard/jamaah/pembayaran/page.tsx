'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Check,
  Copy,
  Clock,
  Building,
  Plane,
  Calendar,
  CreditCard,
  QrCode,
  FileText,
  Upload,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Download,
  Printer,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

interface Bill {
  id: number
  code: string
  type: 'dp' | 'cicilan'
  typeLabel: string
  dueDate: string
  amount: number
  paidAmount: number
  status: 'paid' | 'pending_verification' | 'unpaid'
  statusLabel: string
  paidAt?: string
  proofFile?: string
  receiptNo?: string
}

interface BankOption {
  code: string
  name: string
  accountNumber: string
  accountHolder: string
}

const bankAccounts: BankOption[] = [
  {
    code: 'BSI',
    name: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7001234567',
    accountHolder: 'PT Travel Umroh Haji',
  },
  {
    code: 'BMI',
    name: 'Bank Muamalat',
    accountNumber: '8009876543',
    accountHolder: 'PT Travel Umroh Haji',
  },
  {
    code: 'BMRI',
    name: 'Bank Mandiri',
    accountNumber: '1230009876543',
    accountHolder: 'PT Travel Umroh Haji',
  },
]

export default function JamaahPembayaranPage() {
  // Initial bills matching Laravel dataset
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 1,
      code: 'REG-00001-DP',
      type: 'dp',
      typeLabel: 'Uang Muka (DP)',
      dueDate: '07 Nov 2025',
      amount: 5000000,
      paidAmount: 5000000,
      status: 'paid',
      statusLabel: 'Lunas',
      paidAt: '07 Nov 2025',
      receiptNo: 'KW-2025-001-DP',
    },
    {
      id: 2,
      code: 'REG-00001-C1',
      type: 'cicilan',
      typeLabel: 'Cicilan',
      dueDate: '05 Dec 2025',
      amount: 7833333,
      paidAmount: 7833333,
      status: 'paid',
      statusLabel: 'Lunas',
      paidAt: '05 Dec 2025',
      receiptNo: 'KW-2025-002-C1',
    },
    {
      id: 3,
      code: 'REG-00001-C2',
      type: 'cicilan',
      typeLabel: 'Cicilan',
      dueDate: '05 Jan 2026',
      amount: 7833333,
      paidAmount: 7833333,
      status: 'paid',
      statusLabel: 'Lunas',
      paidAt: '05 Jan 2026',
      receiptNo: 'KW-2026-003-C2',
    },
    {
      id: 4,
      code: 'REG-00001-C3',
      type: 'cicilan',
      typeLabel: 'Cicilan',
      dueDate: '05 Feb 2026',
      amount: 7833333,
      paidAmount: 0,
      status: 'unpaid',
      statusLabel: 'Belum Bayar',
    },
  ])

  // Active selected bill
  const [selectedBillId, setSelectedBillId] = useState<number>(4)

  // Payment method: 'va' | 'qris' | 'cash'
  const [selectedMethod, setSelectedMethod] = useState<'va' | 'qris' | 'cash'>('va')

  // Selected bank
  const [selectedBank, setSelectedBank] = useState<BankOption>(bankAccounts[0])

  // Payment guide tab: 'mbanking' | 'atm' | 'ibanking'
  const [guideTab, setGuideTab] = useState<'mbanking' | 'atm' | 'ibanking'>('mbanking')

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastSubtitle, setToastSubtitle] = useState<string>('Tempelkan pada aplikasi m-Banking atau ATM Anda')
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [senderName, setSenderName] = useState<string>('Ahmad Fauzi')
  const [senderBank, setSenderBank] = useState<string>('')
  const [paymentNote, setPaymentNote] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Kwitansi modal
  const [receiptModalBill, setReceiptModalBill] = useState<Bill | null>(null)

  // Proof modal
  const [viewProofModal, setViewProofModal] = useState<boolean>(false)

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 59,
    seconds: 45,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let total = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1
        if (total <= 0) return { hours: 0, minutes: 0, seconds: 0 }
        return {
          hours: Math.floor(total / 3600),
          minutes: Math.floor((total % 3600) / 60),
          seconds: total % 60,
        }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const showShopeeToast = (title: string, subtitle = 'Tempelkan pada aplikasi m-Banking atau ATM Anda') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToastMessage(title)
    setToastSubtitle(subtitle)
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 2500)
  }

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    showShopeeToast(`${label} Berhasil Disalin!`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        setPreviewUrl('pdf')
      }
    }
  }

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Silakan pilih foto bukti struk transfer terlebih dahulu.')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      setBills((prev) =>
        prev.map((b) =>
          b.id === selectedBillId
            ? {
                ...b,
                status: 'pending_verification',
                statusLabel: 'Verifikasi Admin',
                proofFile: previewUrl || 'uploaded_proof.jpg',
              }
            : b
        )
      )
      setIsSubmitting(false)
      showShopeeToast('Bukti Pembayaran Terkirim!', 'Menunggu verifikasi tim admin travel kami')
    }, 1200)
  }

  // Active bill data
  const activeBill = bills.find((b) => b.id === selectedBillId) || bills[0]

  // Overall financial sums
  const totalBilled = bills.reduce((acc, curr) => acc + curr.amount, 0)
  const totalPaid = bills.filter((b) => b.status === 'paid').reduce((acc, curr) => acc + curr.paidAmount, 0)
  const outstanding = Math.max(0, totalBilled - totalPaid)
  const percentPaid = totalBilled > 0 ? Math.min(100, Math.round((totalPaid / totalBilled) * 100)) : 0

  const formatRupiah = (num: number) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans text-slate-800">
      {/* Shopee-style Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="h-7 w-7 rounded-full bg-emerald-500 grid place-items-center text-white shrink-0">
            <Check size={16} className="stroke-[2.5]" />
          </div>
          <div>
            <p className="text-sm font-semibold">{toastMessage}</p>
            <p className="text-xs text-gray-300">{toastSubtitle}</p>
          </div>
        </div>
      )}

      {/* Shopee Banner Header */}
      <div
        className="rounded-2xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #EE4D2D 0%, #FF6B35 100%)',
        }}
      >
        <div className="absolute -right-8 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-24 top-0 w-32 h-32 bg-yellow-300/10 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
              </svg>
              <span>Shopee Payment Hub &bull; Pembayaran Jamaah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
              Checkout &amp; Pembayaran Umroh / Haji
            </h1>
            <p className="text-orange-100 text-sm mt-1">
              Selesaikan pembayaran dengan mudah, aman, dan instan via Transfer Bank, QRIS, atau Setor Tunai.
            </p>
          </div>

          {/* Countdown Timer Box ala Shopee */}
          <div className="bg-white text-gray-800 p-4 sm:p-5 rounded-2xl shadow-lg border border-orange-100 flex flex-col items-center justify-center min-w-[240px]">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#EE4D2D] animate-pulse" />
              <span>Batas Waktu Pembayaran</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-mono font-black text-xl sm:text-2xl text-gray-900">
              <div className="bg-gray-900 text-white px-2 py-1 rounded-md text-base">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-[#EE4D2D] font-bold">:</span>
              <div className="bg-gray-900 text-white px-2 py-1 rounded-md text-base">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-[#EE4D2D] font-bold">:</span>
              <div className="bg-[#EE4D2D] text-white px-2 py-1 rounded-md text-base">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-2 text-center">
              Jatuh tempo: <strong className="text-gray-800">{activeBill?.dueDate || '05 Feb 2026'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Rincian Pesanan / Paket (Shopee Product Order Card) */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EE4D2D] grid place-items-center font-bold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-base">Travel Umroh &amp; Haji</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Resmi &amp; Terverifikasi
                </span>
              </div>
              <p className="text-xs text-gray-500">
                No. Pendaftaran: <strong className="text-gray-700 font-mono">REG-00001</strong> &bull; Terdaftar: 05 Nov 2025
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Status Pembayaran:</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Sebagian
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shrink-0 grid place-items-center shadow-md">
                <Building className="w-10 h-10 stroke-[1.6]" />
              </div>
              <div className="min-w-0">
                <div
                  className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold mb-1"
                  style={{
                    backgroundColor: '#FFF2EE',
                    color: '#EE4D2D',
                    border: '1px solid #FFD3C4',
                  }}
                >
                  Umroh
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">Umroh Reguler 9 Hari</h3>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 mt-1.5">
                  <span>🗓️ 9 Hari</span>
                  <span>✈️ Saudi Arabian Airlines</span>
                  <span>🏨 Swissôtel Al Maqam Makkah</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Nama Jamaah: <strong className="text-gray-700">Ahmad Fauzi</strong> &bull; NIK:{' '}
                  <span className="font-mono">3201000000000001</span>
                </p>
              </div>
            </div>

            <div className="md:col-span-5 bg-orange-50/50 rounded-2xl p-4 border border-orange-100 space-y-2.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Total Biaya Paket:</span>
                <span className="font-semibold text-gray-900">{formatRupiah(totalBilled)}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700">
                <span>Sudah Dibayar:</span>
                <span className="font-bold">+ {formatRupiah(totalPaid)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentPaid}%`, backgroundColor: '#EE4D2D' }}
                />
              </div>
              <div className="pt-2 border-t border-orange-200/60 flex justify-between items-baseline">
                <span className="text-xs font-semibold text-gray-700">Sisa Tagihan:</span>
                <span className="text-lg font-extrabold text-[#EE4D2D]">{formatRupiah(outstanding)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shopee Term / Installment Tab Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-5 bg-[#EE4D2D] rounded-full inline-block" />
            Pilih Tagihan yang Ingin Dibayar
          </h3>
          <span className="text-xs text-gray-500">Klik tagihan di bawah untuk melihat detail transfer</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bills.map((bill) => {
            const isSelected = selectedBillId === bill.id
            const isPaid = bill.status === 'paid'
            const isPending = bill.status === 'pending_verification'

            return (
              <div
                key={bill.id}
                onClick={() => setSelectedBillId(bill.id)}
                className={`rounded-2xl border p-4.5 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-[#EE4D2D] border-[#EE4D2D] bg-orange-50/40 shadow-md'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                {/* Selected check badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#EE4D2D] text-white rounded-full grid place-items-center shadow-md">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-bold text-gray-700 font-mono">{bill.code}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        bill.type === 'dp'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {bill.typeLabel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Jatuh Tempo: {bill.dueDate}</p>
                  <div className="mt-3">
                    <span className="text-xs text-gray-500">Nominal Tagihan:</span>
                    <p className="text-base font-extrabold text-gray-900">{formatRupiah(bill.amount)}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  {isPaid ? (
                    <>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check size={12} className="stroke-[2.5]" />
                        Lunas
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setReceiptModalBill(bill)
                        }}
                        className="text-xs font-medium text-teal-700 hover:underline flex items-center gap-0.5"
                      >
                        Kwitansi
                        <ExternalLink size={12} />
                      </button>
                    </>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Loader2 size={12} className="animate-spin text-amber-600" />
                      Verifikasi Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EE4D2D] bg-orange-50 px-2.5 py-0.5 rounded-full">
                      Bayar Sekarang &rarr;
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Payment Section for Selected Bill */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metode Pembayaran ala Shopee */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payment Methods Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#EE4D2D]" />
                Metode Pembayaran
              </h4>
              <span className="text-xs bg-orange-50 text-[#EE4D2D] px-2.5 py-1 rounded-full font-semibold border border-orange-100">
                Tagihan: {activeBill.code}
              </span>
            </div>

            <div className="p-6 space-y-4">
              {/* Method 1: Virtual Account & Transfer Bank */}
              <div
                className={`border rounded-2xl p-4 transition-all duration-200 ${
                  selectedMethod === 'va'
                    ? 'border-[#EE4D2D] bg-orange-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={selectedMethod === 'va'}
                    onChange={() => setSelectedMethod('va')}
                    className="mt-1 text-[#EE4D2D] focus:ring-[#EE4D2D] accent-[#EE4D2D]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">Transfer Bank / Virtual Account</span>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Otomatis / Manual
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Dapat ditransfer dari semua bank melalui ATM, m-Banking, atau Internet Banking.
                    </p>

                    {/* Bank Selector Tabs */}
                    {selectedMethod === 'va' && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        <p className="text-xs font-semibold text-gray-700">Pilih Rekening Tujuan:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {bankAccounts.map((bank) => (
                            <button
                              key={bank.code}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                                selectedBank.code === bank.code
                                  ? 'border-[#EE4D2D] bg-white ring-1 ring-[#EE4D2D] shadow-xs'
                                  : 'border-gray-200 bg-gray-50 hover:bg-white'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 grid place-items-center font-bold text-xs shrink-0">
                                {bank.code}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-800 truncate">{bank.name}</p>
                                <p className="text-[11px] text-gray-500 font-mono">{bank.accountNumber}</p>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Virtual Account / Bank Number Display ala Shopee */}
                        <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-gray-500 font-medium">Nomor Rekening / Virtual Account:</span>
                              <p className="text-xs text-gray-500 font-medium">{selectedBank.name}</p>
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                              Rekening Resmi
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 bg-white px-4 py-3 rounded-xl border border-orange-200">
                            <span className="font-mono text-xl sm:text-2xl font-black text-gray-900 tracking-wider">
                              {selectedBank.accountNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(selectedBank.accountNumber, 'Nomor Rekening')}
                              className="px-4 py-1.5 rounded-lg text-white text-xs font-bold transition shadow-xs flex items-center gap-1 active:scale-95"
                              style={{ backgroundColor: '#EE4D2D' }}
                            >
                              <Copy size={14} />
                              SALIN
                            </button>
                          </div>

                          <div className="flex justify-between items-center text-xs text-gray-600 pt-1">
                            <span>Atas Nama:</span>
                            <span className="font-bold text-gray-900">{selectedBank.accountHolder}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Method 2: QRIS (ShopeePay & E-Wallet) */}
              <div
                className={`border rounded-2xl p-4 transition-all duration-200 ${
                  selectedMethod === 'qris'
                    ? 'border-[#EE4D2D] bg-orange-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={selectedMethod === 'qris'}
                    onChange={() => setSelectedMethod('qris')}
                    className="mt-1 text-[#EE4D2D] focus:ring-[#EE4D2D] accent-[#EE4D2D]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">
                        QRIS (ShopeePay / GoPay / OVO / Dana / BCA)
                      </span>
                      <span className="text-[11px] font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                        Scan &amp; Bayar
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Scan kode QRIS menggunakan kamera aplikasi e-wallet atau m-Banking Anda.
                    </p>

                    {selectedMethod === 'qris' && (
                      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col items-center text-center">
                        <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-gray-300 shadow-inner inline-block">
                          <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="200" height="200" fill="white" />
                            <rect x="20" y="20" width="50" height="50" rx="6" fill="#111827" />
                            <rect x="28" y="28" width="34" height="34" rx="2" fill="white" />
                            <rect x="34" y="34" width="22" height="22" rx="2" fill="#111827" />
                            <rect x="130" y="20" width="50" height="50" rx="6" fill="#111827" />
                            <rect x="138" y="28" width="34" height="34" rx="2" fill="white" />
                            <rect x="144" y="34" width="22" height="22" rx="2" fill="#111827" />
                            <rect x="20" y="130" width="50" height="50" rx="6" fill="#111827" />
                            <rect x="28" y="138" width="34" height="34" rx="2" fill="white" />
                            <rect x="34" y="144" width="22" height="22" rx="2" fill="#111827" />
                            <rect x="80" y="25" width="10" height="10" fill="#111827" />
                            <rect x="100" y="25" width="10" height="10" fill="#111827" />
                            <rect x="80" y="45" width="20" height="10" fill="#111827" />
                            <rect x="110" y="45" width="10" height="20" fill="#111827" />
                            <rect x="25" y="80" width="20" height="10" fill="#111827" />
                            <rect x="55" y="80" width="10" height="20" fill="#111827" />
                            <rect x="25" y="105" width="15" height="10" fill="#111827" />
                            <rect x="50" y="105" width="15" height="10" fill="#111827" />
                            <rect x="80" y="80" width="40" height="40" rx="4" fill="#EE4D2D" />
                            <path d="M93 100l5 5 12-12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="130" y="80" width="15" height="15" fill="#111827" />
                            <rect x="155" y="80" width="25" height="10" fill="#111827" />
                            <rect x="140" y="105" width="20" height="10" fill="#111827" />
                            <rect x="170" y="105" width="10" height="20" fill="#111827" />
                            <rect x="80" y="135" width="15" height="15" fill="#111827" />
                            <rect x="105" y="135" width="15" height="25" fill="#111827" />
                            <rect x="80" y="160" width="20" height="15" fill="#111827" />
                            <rect x="130" y="140" width="20" height="10" fill="#111827" />
                            <rect x="160" y="140" width="15" height="15" fill="#111827" />
                            <rect x="140" y="160" width="35" height="15" fill="#111827" />
                          </svg>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                            QRIS Standar Bank Indonesia
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 max-w-sm">
                          Buka aplikasi <strong>Shopee, Gojek, BCA Mobile, OVO, atau Dana</strong>, pilih menu Bayar/Scan QRIS, lalu arahkan kamera ke barcode di atas.
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Method 3: Kantor Cabang / Tunai */}
              <div
                className={`border rounded-2xl p-4 transition-all duration-200 ${
                  selectedMethod === 'cash'
                    ? 'border-[#EE4D2D] bg-orange-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={selectedMethod === 'cash'}
                    onChange={() => setSelectedMethod('cash')}
                    className="mt-1 text-[#EE4D2D] focus:ring-[#EE4D2D] accent-[#EE4D2D]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">Setor Tunai di Kantor Cabang</span>
                      <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        Kasir / Teller
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Datang langsung ke kantor cabang travel kami untuk membayar via kasir resmi.
                    </p>

                    {selectedMethod === 'cash' && (
                      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1.5">
                        <p className="font-semibold text-gray-800">Alamat Kantor Cabang:</p>
                        <p>Jl. Jend. Sudirman No. 45, Jakarta Pusat (Kantor Pusat)</p>
                        <p className="text-gray-500">Jam Layanan: Senin &ndash; Sabtu, 08:30 &ndash; 17:00 WIB</p>
                        <p className="text-gray-500">
                          Tunjukkan kode pendaftaran <strong className="text-gray-800 font-mono">REG-00001</strong> ke kasir.
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Cara Pembayaran (Shopee Style Step Instructions) */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Petunjuk Pembayaran
            </h4>

            {/* Tab Switcher */}
            <div className="flex border-b border-gray-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setGuideTab('mbanking')}
                className={`py-2.5 px-4 border-b-2 font-bold transition ${
                  guideTab === 'mbanking'
                    ? 'border-[#EE4D2D] text-[#EE4D2D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                m-Banking
              </button>
              <button
                type="button"
                onClick={() => setGuideTab('atm')}
                className={`py-2.5 px-4 border-b-2 font-bold transition ${
                  guideTab === 'atm'
                    ? 'border-[#EE4D2D] text-[#EE4D2D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ATM
              </button>
              <button
                type="button"
                onClick={() => setGuideTab('ibanking')}
                className={`py-2.5 px-4 border-b-2 font-bold transition ${
                  guideTab === 'ibanking'
                    ? 'border-[#EE4D2D] text-[#EE4D2D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Internet Banking
              </button>
            </div>

            {/* Steps */}
            <div className="text-xs text-gray-600 space-y-2.5 pt-1">
              {guideTab === 'mbanking' && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      1
                    </span>
                    <p>Buka aplikasi m-Banking Anda (BSI Mobile, Livin&apos; Mandiri, BCA mobile, dll).</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      2
                    </span>
                    <p>
                      Pilih menu <strong>Transfer</strong> &gt; <strong>Rekening Bank Lain / Rekening Virtual Account</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      3
                    </span>
                    <p>
                      Masukkan nomor rekening tujuan{' '}
                      <strong className="font-mono text-gray-900">{selectedBank.accountNumber}</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      4
                    </span>
                    <p>
                      Masukkan nominal tepat <strong className="text-gray-900">{formatRupiah(activeBill.amount)}</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      5
                    </span>
                    <p>
                      Pastikan nama penerima adalah <strong className="text-gray-900">{selectedBank.accountHolder}</strong>, lalu konfirmasi dengan PIN Anda.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      6
                    </span>
                    <p>Simpan screenshot atau resi transfer dan unggah pada formulir konfirmasi di sebelah kanan.</p>
                  </div>
                </div>
              )}

              {guideTab === 'atm' && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      1
                    </span>
                    <p>Masukkan kartu ATM dan PIN Anda di mesin ATM terdekat.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      2
                    </span>
                    <p>
                      Pilih menu <strong>Transaksi Lainnya</strong> &gt; <strong>Transfer</strong> &gt; <strong>Ke Rekening Bank</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      3
                    </span>
                    <p>
                      Masukkan nomor rekening <strong className="font-mono text-gray-900">{selectedBank.accountNumber}</strong> dan jumlah bayar <strong className="text-gray-900">{formatRupiah(activeBill.amount)}</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      4
                    </span>
                    <p>Ambil struk ATM Anda, foto dengan jelas, dan unggah pada kolom di samping.</p>
                  </div>
                </div>
              )}

              {guideTab === 'ibanking' && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      1
                    </span>
                    <p>Login ke portal Internet Banking perbankan Anda.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      2
                    </span>
                    <p>Pilih Transfer Dana &gt; Antar Bank Online / Kliring BI-FAST.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#EE4D2D] font-bold grid place-items-center shrink-0 text-[11px]">
                      3
                    </span>
                    <p>Selesaikan otentikasi transaksi Token/SMS OTP dan simpan bukti file PDF/struk.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ringkasan Pembayaran & Form Upload Bukti ala Shopee */}
        <div className="lg:col-span-5 space-y-6">
          {/* Total Tagihan Box ala Shopee Checkout */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
            <div className="bg-gray-50/70 p-5 border-b border-gray-100 flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm">Ringkasan Tagihan Terpilih</h4>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeBill.status === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : activeBill.status === 'pending_verification'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {activeBill.statusLabel}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Nomor Invoice:</span>
                <span className="font-mono font-bold text-gray-800">{activeBill.code}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Jenis Tagihan:</span>
                <span className="font-semibold text-gray-800">{activeBill.typeLabel}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Jatuh Tempo:</span>
                <span className="font-medium text-gray-800">{activeBill.dueDate}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Total Tagihan:</span>
                <span className="font-semibold text-gray-800">{formatRupiah(activeBill.amount)}</span>
              </div>

              {activeBill.status === 'paid' && (
                <div className="flex justify-between items-center text-xs text-emerald-600">
                  <span>Sudah Dibayar:</span>
                  <span className="font-semibold">{formatRupiah(activeBill.paidAmount)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                  Total yang Harus Dibayar:
                </span>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#EE4D2D]">
                    {formatRupiah(activeBill.status === 'paid' ? 0 : activeBill.amount)}
                  </span>
                  {activeBill.status !== 'paid' && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(String(activeBill.amount), 'Nominal Pembayaran')}
                      className="text-xs text-[#EE4D2D] font-bold hover:underline bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200 cursor-pointer active:scale-95"
                    >
                      Salin Jumlah
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Pastikan transfer dengan nominal tepat untuk mempercepat verifikasi otomatis.
                </p>
              </div>

              {activeBill.status === 'paid' && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white mx-auto grid place-items-center">
                    <Check size={18} className="stroke-[2.5]" />
                  </div>
                  <p className="text-sm font-bold text-emerald-900">Tagihan Ini Telah Lunas</p>
                  <p className="text-xs text-emerald-700">Dibayar pada {activeBill.paidAt || activeBill.dueDate}</p>
                  <button
                    type="button"
                    onClick={() => setReceiptModalBill(activeBill)}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-xs cursor-pointer"
                  >
                    <Download size={14} />
                    Unduh Kwitansi Resmi (PDF)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Konfirmasi & Upload Bukti Pembayaran ala Shopee */}
          {activeBill.status !== 'paid' && (
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/70">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#EE4D2D]" />
                  Konfirmasi / Unggah Bukti Bayar
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sudah transfer? Unggah foto bukti struk atau screenshot m-Banking Anda.
                </p>
              </div>

              <div className="p-6">
                {activeBill.status === 'pending_verification' && (
                  <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-800">
                      <CheckCircle2 size={16} className="text-amber-600" />
                      Bukti Pembayaran Sudah Terkirim
                    </div>
                    <p>Bukti Anda sedang ditinjau &amp; diverifikasi oleh tim admin travel kami.</p>
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setViewProofModal(true)}
                        className="inline-flex items-center gap-1 font-bold text-[#EE4D2D] hover:underline cursor-pointer"
                      >
                        Lihat Bukti Saya &rarr;
                      </button>
                      <span className="text-gray-300">&bull;</span>
                      <span className="text-gray-500">Bisa unggah ulang jika salah</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitProof} className="space-y-4">
                  {/* Upload Box Dropzone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Foto Struk / Screenshot Bukti Transfer <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 hover:border-[#EE4D2D] rounded-2xl transition cursor-pointer relative bg-gray-50/50">
                      <div className="space-y-2 text-center">
                        {!previewUrl ? (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-orange-50 text-[#EE4D2D] grid place-items-center mb-2">
                              <Upload className="w-6 h-6 stroke-[1.8]" />
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-bold text-[#EE4D2D]">Pilih Berkas</span> atau seret foto ke sini
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WEBP, atau PDF (Maks. 5 MB)</p>
                          </div>
                        ) : previewUrl !== 'pdf' ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={previewUrl}
                              alt="Preview Bukti"
                              className="max-h-40 rounded-lg object-contain shadow-xs border border-gray-200"
                            />
                            <p className="text-xs font-semibold text-emerald-600 mt-2">
                              Foto siap diunggah (Klik untuk ganti)
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 grid place-items-center mb-1 text-xs font-bold">
                              PDF
                            </div>
                            <p className="text-xs font-semibold text-gray-800">{selectedFile?.name || 'Dokumen PDF Terpilih'}</p>
                            <p className="text-[11px] text-emerald-600">Klik untuk ganti file</p>
                          </div>
                        )}

                        <input
                          type="file"
                          required={!activeBill.proofFile}
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nama Pemilik Rekening Pengirim
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: Ahmad Fauzi"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5 focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Bank Pengirim</label>
                      <input
                        type="text"
                        placeholder="Misal: BSI / BCA / Mandiri"
                        value={senderBank}
                        onChange={(e) => setSenderBank(e.target.value)}
                        className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5 focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Catatan atau nomor referensi transfer..."
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5 focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl text-white text-sm font-bold transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    style={{
                      background: 'linear-gradient(135deg, #EE4D2D 0%, #FF6B35 100%)',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Mengirim Bukti...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} className="stroke-[2.5]" />
                        <span>Saya Sudah Bayar (Kirim Bukti)</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Shopee Customer Service / Bantuan Box */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900">Butuh Bantuan Pembayaran?</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Hubungi Customer Service travel kami via WhatsApp jika mengalami kendala transfer.
              </p>
            </div>
            <a
              href="https://wa.me/6281200000001?text=Halo%20Admin%2C%20saya%20butuh%20bantuan%20terkait%20pembayaran%20tagihan%20REG-00001"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <span>Chat WA</span>
            </a>
          </div>
        </div>
      </div>

      {/* Kwitansi Modal */}
      {receiptModalBill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 relative border border-slate-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setReceiptModalBill(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Receipt Printable Area */}
            <div className="border border-slate-200 rounded-xl p-6 bg-white space-y-4">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Travel Umroh &amp; Haji</h2>
                  <p className="text-xs text-slate-400">Kwitansi Tanda Terima Pembayaran Resmi</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[#EE4D2D]">
                    {receiptModalBill.receiptNo || `KW-${receiptModalBill.code}`}
                  </span>
                  <p className="text-[11px] text-slate-400">{receiptModalBill.paidAt || receiptModalBill.dueDate}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Telah diterima dari:</span>
                  <span className="font-bold text-slate-800">Ahmad Fauzi</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Nomor Registrasi:</span>
                  <span className="font-mono font-semibold text-slate-700">REG-00001</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Untuk Pembayaran:</span>
                  <span className="font-semibold text-slate-700">
                    {receiptModalBill.typeLabel} - Umroh Reguler 9 Hari ({receiptModalBill.code})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Metode Pembayaran:</span>
                  <span className="font-semibold text-slate-700">Transfer Bank (BSI)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Status Transaksi:</span>
                  <span className="font-bold text-emerald-600">LUNAS &amp; TERVERIFIKASI</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3.5 flex items-center justify-between border border-slate-100">
                <span className="text-xs font-bold text-slate-600">Jumlah Pembayaran:</span>
                <span className="text-lg font-black text-[#EE4D2D]">{formatRupiah(receiptModalBill.amount)}</span>
              </div>

              <div className="pt-4 flex justify-between items-end text-[11px] text-slate-400 border-t border-slate-100">
                <div>
                  <p>Dicetak otomatis oleh Sistem Manajemen Umroh &amp; Haji</p>
                  <p className="italic">Kwitansi ini sah tanpa tanda tangan basah.</p>
                </div>
                <div className="text-right">
                  <div className="inline-block border border-emerald-500 text-emerald-600 font-bold px-2.5 py-1 rounded text-[10px] uppercase tracking-wider rotate-[-5deg]">
                    ✓ LUNAS RESMI
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReceiptModalBill(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} />
                Cetak / Simpan PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Preview Modal */}
      {viewProofModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-slate-200">
            <button
              type="button"
              onClick={() => setViewProofModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Bukti Pembayaran Terkirim</h3>
            <div className="rounded-xl border border-slate-200 p-2 bg-slate-50 flex items-center justify-center min-h-[200px]">
              {previewUrl && previewUrl !== 'pdf' ? (
                <img src={previewUrl} alt="Bukti Transfer" className="max-h-72 object-contain rounded-lg" />
              ) : (
                <div className="text-center p-4">
                  <FileText className="w-12 h-12 text-teal-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">File Bukti Terlampir</p>
                  <p className="text-[11px] text-slate-400 mt-1">Status: Sedang dalam antrean verifikasi finance</p>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setViewProofModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition cursor-pointer"
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
