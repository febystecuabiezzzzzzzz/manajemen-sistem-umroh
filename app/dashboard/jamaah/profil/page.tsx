'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, User, Mail, Phone, Lock, Save, LogOut } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { createClient } from '@/lib/supabase/client'

export default function JamaahProfilPage() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    nama: 'Ahmad Fauzi',
    email: 'jamaah@example.com',
    telepon: '0812-9988-7766',
    role: 'Jamaah',
    nik: '3171012345670001',
    passwordBaru: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Profil jamaah berhasil diperbarui!', 'success')
  }

  const handleLogout = async () => {
    document.cookie = 'demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    window.location.href = '/login'
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/jamaah" className="hover:text-slate-600">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Profil Saya</span>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-xs flex-shrink-0"
            style={{ background: '#0f766e' }}
          >
            AF
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">{formData.nama}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{formData.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                NIK: {formData.nik}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut size={14} />
          <span>Keluar</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
          Data Pribadi
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Sesuai KTP</label>
          <input
            type="text"
            required
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
            <input
              type="text"
              value={formData.telepon}
              onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0f766e]"
            />
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d6962] transition-colors shadow-xs cursor-pointer"
          >
            <Save size={14} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  )
}
