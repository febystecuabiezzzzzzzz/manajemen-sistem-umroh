'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success'
          const isError = toast.type === 'error'

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-sm transition-all"
              style={{
                backgroundColor: isSuccess ? '#ecfdf5' : isError ? '#fef2f2' : '#f8fafc',
                borderColor: isSuccess ? '#a7f3d0' : isError ? '#fecaca' : '#e2e8f0',
                color: isSuccess ? '#065f46' : isError ? '#991b1b' : '#1e293b',
              }}
            >
              <div className="flex items-center gap-2.5">
                {isSuccess && <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />}
                {isError && <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />}
                {!isSuccess && !isError && <Info size={18} className="text-slate-600 flex-shrink-0" />}
                <span className="font-medium">{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded hover:bg-black/5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer ml-2"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      showToast: (message: string, type: ToastType = 'success') => {
        if (typeof window !== 'undefined') {
          console.log(`[Toast ${type}]: ${message}`)
        }
      },
    }
  }
  return context
}
