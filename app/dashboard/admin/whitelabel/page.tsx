'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Save, Upload, Palette } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { initials } from '@/lib/helpers'

export default function WhiteLabelPage() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState({
    app_name: 'Travel Umroh & Haji',
    app_subtitle: 'Sistem Manajemen Umroh & Haji Terpadu',
    company_phone: '0812-3456-7890',
    company_email: 'support@travelumroh.com',
    company_address: 'Jl. Sudirman No. 45, Jakarta Pusat',
    footer_text: '© 2026 Travel Umroh & Haji — All Rights Reserved.',
    primary_color: '#0d9488',
    secondary_color: '#0f766e',
    logo_path: '',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Pengaturan white-label berhasil disimpan (cache otomatis diperbarui)!', 'success')
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/dashboard/admin" className="hover:text-slate-600">Beranda</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">White-label</span>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pengaturan White-label</h1>
        <p className="text-xs text-slate-400 mt-0.5">Branding tampil di seluruh aplikasi (cache otomatis diperbarui).</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Identitas Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Identitas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Aplikasi <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={settings.app_name}
                  onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0d9488]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subjudul</label>
                <input
                  type="text"
                  value={settings.app_subtitle}
                  onChange={(e) => setSettings({ ...settings, app_subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0d9488]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Telepon</label>
                <input
                  type="text"
                  value={settings.company_phone}
                  onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0d9488]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.company_email}
                  onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0d9488]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat</label>
                <textarea
                  rows={2}
                  value={settings.company_address}
                  onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0d9488]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teks Footer</label>
                <input
                  type="text"
                  value={settings.footer_text}
                  onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0d9488]"
                />
              </div>
            </div>
          </div>

          {/* Warna & Logo Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Warna & Logo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Warna Utama (hex) <span className="text-rose-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-9 h-9 rounded border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0d9488] font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Warna Sekunder (hex) <span className="text-rose-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="w-9 h-9 rounded border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0d9488] font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Logo (PNG/JPG, maks 2MB)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">Kosongkan jika tidak ingin mengubah.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Favicon</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">Kosongkan jika tidak ingin mengubah.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pratinjau Card */}
        <div>
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-5 sticky top-20">
            <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">Pratinjau</h2>
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              {settings.logo_path ? (
                <img src={settings.logo_path} className="h-12 w-12 object-contain rounded" alt="logo" />
              ) : (
                <div
                  className="h-12 w-12 rounded-lg grid place-items-center text-white font-bold text-base shadow-sm shrink-0"
                  style={{ background: settings.primary_color }}
                >
                  {initials(settings.app_name || 'KT')}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{settings.app_name || 'Travel Umroh & Haji'}</p>
                <p className="text-xs text-slate-400 truncate">{settings.app_subtitle || 'Tagline / Subjudul'}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50/50 rounded-lg text-xs space-y-1.5 border border-slate-100">
              <div className="flex justify-between text-slate-500">
                <span>Warna Primer:</span>
                <span className="font-mono font-medium text-slate-700">{settings.primary_color}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Warna Sekunder:</span>
                <span className="font-mono font-medium text-slate-700">{settings.secondary_color}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>CS:</span>
                <span className="text-slate-700 truncate">{settings.company_phone}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white shadow-xs cursor-pointer transition-all"
              style={{ background: settings.primary_color }}
            >
              <Save size={14} />
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
