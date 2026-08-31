'use client'

import { Menu, Wifi, WifiOff, ShieldCheck } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { online, setOnline, pendingCount } = useStore()
  const [clock, setClock] = useState('--:--:--')

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-GB', { hour12: false }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        className="rounded-md p-2 text-muted-foreground hover:bg-secondary lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
        <ShieldCheck className="size-4 text-primary" />
        <span className="font-mono text-xs uppercase tracking-widest">RPF Control Room · Central Zone</span>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span className="hidden font-mono text-sm tabular-nums text-muted-foreground md:inline">
          {clock}
        </span>

        <button
          type="button"
          onClick={() => setOnline(!online)}
          className={cn(
            'flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors',
            online
              ? 'border-risk-low/30 bg-risk-low/10 text-risk-low'
              : 'border-risk-high/30 bg-risk-high/10 text-risk-high',
          )}
          title="Toggle simulated connectivity"
        >
          {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
          {online ? 'ONLINE' : 'OFFLINE'}
          {!online && pendingCount > 0 && (
            <span className="rounded-full bg-risk-high/25 px-1.5">{pendingCount}</span>
          )}
        </button>

        <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-2 py-1 sm:flex">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-semibold text-primary">
            OP
          </div>
          <div className="pr-1 leading-tight">
            <p className="text-xs font-medium">Officer Rao</p>
            <p className="text-[10px] text-muted-foreground">Duty Inspector</p>
          </div>
        </div>
      </div>
    </header>
  )
}
