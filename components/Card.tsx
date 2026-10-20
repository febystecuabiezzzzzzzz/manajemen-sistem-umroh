import React from 'react'

export function Card({
  title,
  subtitle,
  actions,
  padding = 'p-5',
  className = '',
  children,
}: {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  padding?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            {title && <h3 className="font-semibold text-gray-800">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
    </div>
  )
}
