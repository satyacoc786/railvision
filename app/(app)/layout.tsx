'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { TopBar } from '@/components/top-bar'
import { StoreProvider } from '@/lib/store'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <StoreProvider>
      <div className="min-h-svh">
        <AppSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="lg:pl-64">
          <TopBar onMenu={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </StoreProvider>
  )
}
