/**
 * Indonesian Currency and Formatting Helpers matching Laravel Helpers
 */

export function currency(amount: number | string | null | undefined, withSymbol = true): string {
  const value = Math.round(Number(amount || 0))
  const formatted = value.toLocaleString('id-ID')
  return withSymbol ? `Rp ${formatted}` : formatted
}

export const formatCurrency = currency

/**
 * Spells out integer amount in Indonesian words (for kwitansi receipt)
 */
export function terbilang(number: number | string | null | undefined): string {
  let n = Math.abs(Math.floor(Number(number || 0)))
  if (n === 0) return 'Nol Rupiah'

  const words = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima',
    'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'
  ]

  function spell(val: number): string {
    if (val < 12) return ' ' + words[val]
    if (val < 20) return spell(val - 10) + ' belas'
    if (val < 100) return spell(Math.floor(val / 10)) + ' puluh' + spell(val % 10)
    if (val < 200) return ' seratus' + spell(val - 100)
    if (val < 1000) return spell(Math.floor(val / 100)) + ' ratus' + spell(val % 100)
    if (val < 2000) return ' seribu' + spell(val - 1000)
    if (val < 1000000) return spell(Math.floor(val / 1000)) + ' ribu' + spell(val % 1000)
    if (val < 1000000000) return spell(Math.floor(val / 1000000)) + ' juta' + spell(val % 1000000)
    if (val < 1000000000000) return spell(Math.floor(val / 1000000000)) + ' miliar' + spell(val % 1000000000)
    return spell(Math.floor(val / 1000000000000)) + ' triliun' + spell(val % 1000000000000)
  }

  const result = spell(n).trim().replace(/\s+/g, ' ')
  return result.charAt(0).toUpperCase() + result.slice(1) + ' Rupiah'
}

export function formatDate(date: string | Date | null | undefined, placeholder = '-'): string {
  if (!date) return placeholder
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return placeholder
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
  } catch {
    return placeholder
  }
}

export function formatDateTime(date: string | Date | null | undefined, placeholder = '-'): string {
  if (!date) return placeholder
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return placeholder
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d)
  } catch {
    return placeholder
  }
}

export function initials(name: string | null | undefined): string {
  if (!name) return 'TU'
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'TU'
}

export function roleLabel(role: string | null | undefined): string {
  const r = (role || '').toLowerCase()
  if (r === 'super_admin' || r === 'superadmin') return 'Super Admin'
  if (r === 'admin') return 'Admin Cabang'
  if (r === 'agent' || r === 'agen') return 'Agen / Marketing'
  if (r === 'pilgrim' || r === 'jamaah') return 'Jamaah'
  if (r === 'guide' || r === 'muthawif') return 'Muthawif / Pembimbing'
  return 'Staff'
}

export function roleBadgeColor(role: string | null | undefined): { bg: string; text: string; border: string } {
  const r = (role || '').toLowerCase()
  if (r === 'super_admin' || r === 'superadmin') {
    return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
  }
  if (r === 'admin') {
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
  }
  if (r === 'agent' || r === 'agen') {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  }
  if (r === 'pilgrim' || r === 'jamaah') {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
  }
  if (r === 'guide' || r === 'muthawif') {
    return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' }
  }
  return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' }
}
