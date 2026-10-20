'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Building2,
  Package,
  Hotel,
  Plane,
  Landmark,
  Globe,
  UserCheck,
  Users,
  ClipboardList,
  FileText,
  CreditCard,
  BookOpen,
  Map,
  Briefcase,
  Percent,
  Megaphone,
  UserCog,
  Palette,
  Clock,
  LogOut,
  Menu,
  X,
  Calendar,
  Database,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  role: 'super_admin' | 'admin' | 'muthawif' | 'jamaah' | 'agent' | 'pilgrim' | 'guide'
  userName?: string
  userEmail?: string
}

interface MenuItem {
  href: string
  label: string
  icon: any
}

interface MenuSection {
  section?: string
  items: MenuItem[]
}

function getAdminMenuSections(isSuper: boolean): MenuSection[] {
  return [
    {
      items: [
        { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      section: 'MASTER DATA',
      items: [
        ...(isSuper ? [{ href: '/dashboard/admin/cabang', label: 'Cabang', icon: Building2 }] : []),
        { href: '/dashboard/admin/paket', label: 'Paket', icon: Package },
        { href: '/dashboard/admin/hotel', label: 'Hotel', icon: Hotel },
        { href: '/dashboard/admin/maskapai', label: 'Maskapai', icon: Plane },
        { href: '/dashboard/admin/rekening', label: 'Rekening Bank', icon: Landmark },
        { href: '/dashboard/admin/agen', label: 'Agen', icon: Globe },
        { href: '/dashboard/admin/muthawif', label: 'Muthawif', icon: UserCheck },
        { href: '/dashboard/admin/jamaah', label: 'Jamaah', icon: Users },
      ],
    },
    {
      section: 'OPERASIONAL',
      items: [
        { href: '/dashboard/admin/pendaftaran', label: 'Pendaftaran', icon: ClipboardList },
        { href: '/dashboard/admin/dokumen', label: 'Dokumen', icon: FileText },
        { href: '/dashboard/admin/pembayaran', label: 'Pembayaran', icon: CreditCard },
        { href: '/dashboard/admin/manasik', label: 'Manasik', icon: BookOpen },
        { href: '/dashboard/admin/manifest', label: 'Manifest & Rooming', icon: Map },
        { href: '/dashboard/admin/perlengkapan', label: 'Perlengkapan', icon: Briefcase },
        { href: '/dashboard/admin/komisi', label: 'Komisi Agen', icon: Percent },
        { href: '/dashboard/admin/pengumuman', label: 'Pengumuman', icon: Megaphone },
      ],
    },
    {
      section: 'SISTEM',
      items: [
        { href: '/dashboard/admin/pengguna', label: 'Pengguna', icon: UserCog },
        { href: '/dashboard/admin/sql-editor', label: 'SQL Editor & Supabase', icon: Database },
        ...(isSuper ? [{ href: '/dashboard/admin/whitelabel', label: 'White-label', icon: Palette }] : []),
        { href: '/dashboard/admin/log', label: 'Log Aktivitas', icon: Clock },
      ],
    },
  ]
}

const agentMenuSections: MenuSection[] = [
  {
    items: [
      { href: '/dashboard/agent', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'MARKETING',
    items: [
      { href: '/dashboard/agent/jamaah', label: 'Jamaah Referral', icon: Users },
      { href: '/dashboard/agent/pendaftaran', label: 'Pendaftaran', icon: ClipboardList },
      { href: '/dashboard/agent/komisi', label: 'Komisi Saya', icon: Percent },
    ],
  },
]

const jamaahMenuSections: MenuSection[] = [
  {
    items: [
      { href: '/dashboard/jamaah', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'PERJALANAN SAYA',
    items: [
      { href: '/dashboard/jamaah/pendaftaran', label: 'Pendaftaran Saya', icon: ClipboardList },
      { href: '/dashboard/jamaah/dokumen', label: 'Dokumen Saya', icon: FileText },
      { href: '/dashboard/jamaah/pembayaran', label: 'Pembayaran', icon: CreditCard },
      { href: '/dashboard/jamaah/manasik', label: 'Jadwal Manasik', icon: Calendar },
    ],
  },
]

const muthawifMenuSections: MenuSection[] = [
  {
    items: [
      { href: '/dashboard/muthawif', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'BIMBINGAN',
    items: [
      { href: '/dashboard/muthawif/jamaah', label: 'Jamaah Bimbingan', icon: Users },
      { href: '/dashboard/muthawif/manasik', label: 'Manasik & Absensi', icon: Calendar },
    ],
  },
]

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Map role aliases and get menu
  const isSuper = role === 'super_admin'
  const normalizedRole = role === 'super_admin' ? 'admin' : role === 'pilgrim' ? 'jamaah' : role === 'guide' ? 'muthawif' : role
  const sections = normalizedRole === 'admin' 
    ? getAdminMenuSections(isSuper || role === 'admin') 
    : normalizedRole === 'agent' 
    ? agentMenuSections 
    : normalizedRole === 'muthawif' 
    ? muthawifMenuSections 
    : jamaahMenuSections


  const handleLogout = async () => {
    document.cookie = 'demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    const basePath = `/dashboard/${role}`
    if (href === basePath) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100 flex-shrink-0">
        <div
          className="h-9 w-9 rounded-lg bg-brand text-white grid place-items-center font-bold text-sm flex-shrink-0 shadow-xs"
        >
          TU
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate">
            Travel Umroh &amp; Haji
          </p>
          <p className="text-[11px] text-gray-400 truncate">
            Sistem Manajemen Umroh &amp; Haji
          </p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {sec.section && (
              <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {sec.section}
              </p>
            )}
            {sec.items.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition ${
                    active ? 'nav-active' : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      active ? 'text-brand-dark' : 'text-gray-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="border-t border-gray-100 p-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0 text-gray-400" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        id="sidebar-toggle"
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <X size={18} className="text-gray-700" />
        ) : (
          <Menu size={18} className="text-gray-700" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-gray-200`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-gray-200 bg-white">
        <SidebarContent />
      </aside>
    </>
  )
}
