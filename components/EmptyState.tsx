import React from 'react'
import { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title = 'Belum ada data',
  message = 'Data akan tampil di sini setelah ditambahkan.',
  action,
}: {
  icon?: LucideIcon
  title?: string
  message?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="h-14 w-14 rounded-full bg-gray-100 grid place-items-center text-gray-400 mb-3">
        {Icon ? <Icon className="w-7 h-7" /> : null}
      </div>
      <p className="font-medium text-gray-600">{title}</p>
      <p className="text-sm text-gray-400 mt-1 max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
