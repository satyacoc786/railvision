'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrainFront, X } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'

export function AppSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()
  const { pendingCount, alerts } = useStore()
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE').length

  const badgeFor = (href: string) => {
    if (href === '/sync' && pendingCount > 0) return pendingCount
    if (href === '/alerts' && activeAlerts > 0) return activeAlerts
    return null
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrainFront className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="font-mono text-sm font-bold tracking-tight text-sidebar-foreground">
                RAILVISION
              </p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Security Intel
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            const badge = badgeFor(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-primary/12 text-sidebar-primary'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                )}
              >
                <item.icon className={cn('size-4 shrink-0', active ? 'text-sidebar-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
                <span className="flex-1 truncate">{item.label}</span>
                {badge != null && (
                  <span
                    className={cn(
                      'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[10px] font-semibold',
                      item.href === '/alerts'
                        ? 'bg-risk-high/20 text-risk-high'
                        : 'bg-primary/20 text-primary',
                    )}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Prototype build for demonstration. All device feeds and detections are
              <span className="text-risk-medium"> simulated</span>.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
