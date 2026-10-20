'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Mail, Lock, Check, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('superadmin@example.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Determine target role based on email
    let role = 'admin'
    if (email.toLowerCase().includes('muthawif')) {
      role = 'muthawif'
    } else if (email.toLowerCase().includes('agen') || email.toLowerCase().includes('agent')) {
      role = 'agent'
    } else if (email.toLowerCase().includes('jamaah') || email.toLowerCase().includes('ahmad')) {
      role = 'jamaah'
    } else {
      role = 'admin'
    }

    // Set demo cookie for instant local login
    document.cookie = `demo_role=${role}; path=/; max-age=86400`

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!authError && data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profile?.role) {
          role = profile.role
          document.cookie = `demo_role=${role}; path=/; max-age=86400`
        }
      }
    } catch {
      // Local fallback
    }

    router.push(`/dashboard/${role}`)
    router.refresh()
  }

  const setDemo = (userRole: 'admin' | 'muthawif' | 'jamaah' | 'agent') => {
    if (userRole === 'admin') {
      setEmail('superadmin@example.com')
      setPassword('password123')
    } else if (userRole === 'agent') {
      setEmail('agen@example.com')
      setPassword('password123')
    } else if (userRole === 'muthawif') {
      setEmail('muthawif@example.com')
      setPassword('password123')
    } else {
      setEmail('jamaah@example.com')
      setPassword('password123')
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Column: Teal with branding & Mosque illustration */}
      <div
        className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #10806f 0%, #0d7061 50%, #095a4e 100%)',
        }}
      >
        {/* Mosque Silhouette Overlay at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20 flex justify-center">
          <svg
            viewBox="0 0 1000 340"
            className="w-full h-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Minarets */}
            <rect x="60" y="80" width="30" height="260" fill="white" />
            <polygon points="75,20 60,80 90,80" fill="white" />
            <rect x="910" y="80" width="30" height="260" fill="white" />
            <polygon points="925,20 910,80 940,80" fill="white" />
            {/* Secondary Minarets */}
            <rect x="220" y="120" width="24" height="220" fill="white" />
            <polygon points="232,70 220,120 244,120" fill="white" />
            <rect x="756" y="120" width="24" height="220" fill="white" />
            <polygon points="768,70 756,120 780,120" fill="white" />
            {/* Main Dome */}
            <path
              d="M380 340 V 220 C 380 140, 500 80, 500 80 C 500 80, 620 140, 620 220 V 340 Z"
              fill="white"
            />
            {/* Side Domes */}
            <path
              d="M260 340 V 240 C 260 180, 360 140, 360 140 C 360 140, 420 180, 420 240 V 340 Z"
              fill="white"
            />
            <path
              d="M580 340 V 240 C 580 180, 640 140, 640 140 C 640 140, 740 180, 740 240 V 340 Z"
              fill="white"
            />
            <rect x="0" y="320" width="1000" height="20" fill="white" />
          </svg>
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            TU
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">
              Travel Umroh & Haji
            </h1>
            <p className="text-white/75 text-[11px] leading-tight">
              Sistem Manajemen Umroh & Haji
            </p>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-white/95 bg-white/10 border border-white/20 mb-6 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            Sistem Terintegrasi Multi-Cabang
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            Kelola perjalanan ibadah dengan lebih tenang.
          </h2>

          <p className="text-white/80 text-sm leading-relaxed mb-8">
            Pendaftaran jamaah, dokumen, pembayaran, manasik, manifest
            keberangkatan, hingga komisi agen — semuanya rapi dalam satu
            platform.
          </p>

          <div className="space-y-3.5">
            {[
              'Data jamaah & dokumen terpusat dan aman',
              'Pembayaran, cicilan, dan kuitansi otomatis',
              'Manasik, manifest, serta komisi agen real-time',
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-white stroke-[3]" />
                </div>
                <span className="text-white/90 text-sm font-normal">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 pt-4">
          <p className="text-white/70 text-xs font-normal">
            © 2026 Travel Umroh & Haji — Sistem Manajemen Umroh & Haji.
          </p>
        </div>
      </div>

      {/* Right Column: Clean White Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white min-h-[600px]">
        <div className="hidden lg:block" />

        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Selamat datang kembali
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Masuk menggunakan akun Anda untuk melanjutkan.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg text-xs bg-rose-50 border border-rose-200 text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-[#0f766e] hover:underline"
                >
                  Lupa password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0f766e] focus:ring-[#0f766e] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-xs text-slate-600 select-none cursor-pointer"
              >
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="btn-masuk"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all shadow-xs flex items-center justify-center cursor-pointer mt-2"
              style={{ background: '#0f766e' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Info Notice Box */}
          <div className="mt-6 p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Belum punya akun? Akun jamaah, agen, dan muthawif dibuat oleh
              staf kantor. Silakan hubungi admin cabang Anda untuk mendapatkan
              akses.
            </p>
          </div>

          {/* Quick Demo Switcher Buttons */}
          <div className="mt-5 p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col items-center gap-2 text-xs">
            <span className="text-[11px] font-medium text-slate-500">
              Pilih Role Akun Cepat (Klik untuk isi otomatis):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDemo('admin')}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-slate-700 hover:border-[#0f766e] hover:text-[#0f766e] transition-colors text-xs cursor-pointer shadow-2xs"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => setDemo('agent')}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-slate-700 hover:border-[#0f766e] hover:text-[#0f766e] transition-colors text-xs cursor-pointer shadow-2xs"
              >
                Agen
              </button>
              <button
                type="button"
                onClick={() => setDemo('jamaah')}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-slate-700 hover:border-[#0f766e] hover:text-[#0f766e] transition-colors text-xs cursor-pointer shadow-2xs"
              >
                Jamaah
              </button>
              <button
                type="button"
                onClick={() => setDemo('muthawif')}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-slate-700 hover:border-[#0f766e] hover:text-[#0f766e] transition-colors text-xs cursor-pointer shadow-2xs"
              >
                Muthawif
              </button>
            </div>
          </div>
        </div>

        {/* Footer Right */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()}{' '}
            <a
              href="https://id.shp.ee/gteU4cYe"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#0d9488] hover:underline"
            >
              Toko Source Code
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
