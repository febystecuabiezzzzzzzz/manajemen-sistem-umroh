import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items = [], baseHref = '/dashboard/admin' }: { items?: BreadcrumbItem[]; baseHref?: string }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3" aria-label="Breadcrumb">
      <Link href={baseHref} className="hover:text-brand">
        Beranda
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-brand">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
