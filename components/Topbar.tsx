'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, User, LogOut, Check, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useBranch } from '@/components/BranchContext'
import { roleBadgeColor, roleLabel } from '@/lib/helpers'

interface TopbarProps {
  title?: string
  subtitle?: string
  userName?: string
  userRole?: string
  userEmail?: string
  showBranchSelector?: boolean
}

export function Topbar({
  userName = 'Super Admin',
  userRole = 'Super Admin',
  userEmail = 'superadmin@example.com',
  showBranchSelector = false,
}: TopbarProps) {
  const router = useRouter()
  const { selectedBranch, setSelectedBranch, branches } = useBranch()

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)
  const branchRef = useRef<HTMLDivElement>(null)

  // Get initials
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
        setBranchDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle Logout
  const handleLogout = async () => {
    // 1. Clear session cookie
    document.cookie = 'demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    // 2. Call Supabase SignOut if configured
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}

    // 3. Hard redirect to prevent back-button caching
    window.location.href = '/login'
  }

  // Determine profile link based on role
  const getProfileLink = () => {
    if (userRole.toLowerCase().includes('jamaah')) return '/dashboard/jamaah/profil'
    if (userRole.toLowerCase().includes('muthawif')) return '/dashboard/muthawif/profil'
    if (userRole.toLowerCase().includes('agen') || userRole.toLowerCase().includes('agent')) return '/dashboard/agent'
    return '/dashboard/admin/profil'
  }

  // Indonesian dynamic date
  const [currentDateStr, setCurrentDateStr] = useState('')
  useEffect(() => {
    const formatted = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
    setCurrentDateStr(formatted)
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      {/* Left: Greeting & Date */}
      <div className="flex items-center gap-3">
        <div className="pl-9 lg:pl-0">
          <p className="text-sm font-semibold text-gray-700">
            Selamat datang
          </p>
          <p className="text-[11px] text-gray-400">
            {currentDateStr || 'Memuat tanggal...'}
          </p>
        </div>
      </div>

      {/* Right: Branch Selector & Profile */}
      <div className="flex items-center gap-3">
        {/* Branch focus selector (super admin only) */}
        {showBranchSelector && (
          <div className="hidden sm:block">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg py-1.5 px-3 focus:border-brand focus:ring-0 text-gray-700 bg-white cursor-pointer outline-none"
            >
              <option value="Semua Cabang">Semua Cabang</option>
              {branches.map((b) => (
                <option key={b.id} value={b.nama}>
                  {b.nama}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* User Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 text-sm cursor-pointer select-none"
          >
            <div className="h-8 w-8 rounded-full bg-brand text-white grid place-items-center text-xs font-semibold">
              {initials || 'SA'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-gray-700 font-medium leading-tight">{userName}</p>
              <p className="text-[11px] text-gray-400 leading-tight">{roleLabel(userRole)}</p>
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 text-sm z-50">
              <Link
                href={getProfileLink()}
                onClick={() => setProfileDropdownOpen(false)}
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Profil Saya
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
