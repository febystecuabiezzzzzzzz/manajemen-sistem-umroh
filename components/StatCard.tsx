'use client'

import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color?: 'teal' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose'
  sub?: string
}

const colorMap = {
  teal: {
    bg: '#f0fdfa',
    text: '#0d9488',
  },
  blue: {
    bg: '#eff6ff',
    text: '#3b82f6',
  },
  emerald: {
    bg: '#ecfdf5',
    text: '#10b981',
  },
  amber: {
    bg: '#fffbeb',
    text: '#f59e0b',
  },
  purple: {
    bg: '#faf5ff',
    text: '#8b5cf6',
  },
  rose: {
    bg: '#fff1f2',
    text: '#f43f5e',
  },
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = 'teal',
  sub,
}: StatCardProps) {
  const c = colorMap[color]

  return (
    <div
      className="bg-white rounded-xl p-4 sm:p-5 flex items-center gap-4 transition-all"
      style={{
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: c.bg }}
      >
        <Icon size={22} style={{ color: c.text }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-normal text-slate-400 mb-0.5 truncate">
          {label}
        </div>
        <div className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-none truncate">
          {value}
        </div>
        {sub && (
          <div className="text-[11px] text-slate-400 mt-1 font-normal truncate">
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}
