import React from 'react'
import Link from 'next/link'

export function ActionLink({
  href,
  onClick,
  icon: Icon,
  variant = 'primary',
  children,
  className = '',
}: {
  href?: string
  onClick?: () => void
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  children: React.ReactNode
  className?: string
}) {
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-brand hover:underline',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  const cls = variants[variant] || variants.primary
  const fullCls = `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer select-none ${cls} ${className}`

  if (href) {
    return (
      <Link href={href} className={fullCls}>
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{children}</span>
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={fullCls}>
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  )
}
