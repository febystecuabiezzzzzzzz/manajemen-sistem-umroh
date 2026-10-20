import React from 'react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="px-6 py-4 text-center text-xs text-gray-400 print:hidden mt-auto">
      <div>Travel Umroh &amp; Haji - Sistem Manajemen Umroh &amp; Haji.</div>
      <div className="mt-1">
        &copy; {currentYear}{' '}
        <a
          href="https://id.shp.ee/gteU4cYe"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand hover:underline"
        >
          Toko Source Code
        </a>
      </div>
    </footer>
  )
}
