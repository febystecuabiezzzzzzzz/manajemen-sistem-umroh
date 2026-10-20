import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/Toast'
import { BranchProvider } from '@/components/BranchContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Travel Umroh & Haji - Sistem Manajemen Umroh & Haji',
  description:
    'Platform manajemen perjalanan ibadah Umrah dan Haji terpercaya. Kelola jamaah, pembayaran, dokumen, dan manasik dengan mudah.',
  keywords: ['umrah', 'haji', 'travel', 'manajemen', 'jamaah'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-full antialiased bg-[#f8fafc]">
        <ToastProvider>
          <BranchProvider>{children}</BranchProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
