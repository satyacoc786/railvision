'use client'

import { useState } from 'react'
import { CloudOff, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export default function SyncPage() {
  const { online, setOnline, pendingCount, syncNext } = useStore()
  const [log, setLog] = useState<string[]>([])
  const [syncing, setSyncing] = useState(false)

  function appendLog(line: string) {
    const ts = new Date().toLocaleTimeString('en-GB', { hour12: false })
    setLog((prev) => [`[${ts}] ${line}`, ...prev].slice(0, 40))
  }

  function handleToggle(value: boolean) {
    setOnline(value)
    appendLog(value ? 'Link restored — control room reachable.' : 'Link lost — buffering events locally.')
  }

  async function handleSync() {
    if (pendingCount === 0 || syncing) return
    setSyncing(true)
    appendLog(`Sync started — ${pendingCount} buffered event(s).`)
    let remaining = pendingCount
    while (remaining > 0) {
      await new Promise((r) => setTimeout(r, 650))
      remaining = syncNext()
      appendLog(`Uploaded event — ${remaining} remaining.`)
    }
    appendLog('Sync complete — all buffered events delivered.')
    setSyncing(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Offline Sync"
        icon={<RefreshCw className="size-5" />}
        description="Field devices continue capturing events without connectivity, then sync to the control room when the link is restored. This simulates the store-and-forward behavior of the RAILVISION edge fleet."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex size-11 items-center justify-center rounded-lg border',
                  online
                    ? 'border-risk-low/40 bg-risk-low/10 text-risk-low'
                    : 'border-risk-high/40 bg-risk-high/10 text-risk-high',
                )}
              >
                {online ? <Wifi className="size-5" /> : <WifiOff className="size-5" />}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {online ? 'Connected' : 'Offline'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {online ? 'Events stream in real time' : 'Events buffered on device'}
                </p>
              </div>
            </div>
            <Switch checked={online} onCheckedChange={handleToggle} aria-label="Toggle connectivity" />
          </div>

          <div className="rounded-lg border border-border bg-secondary/30 p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CloudOff className="size-4" />
                Buffered events
              </span>
              <span
                className={cn(
                  'font-mono text-3xl font-semibold tabular-nums',
                  pendingCount > 0 ? 'text-risk-medium' : 'text-risk-low',
                )}
              >
                {pendingCount}
              </span>
            </div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: Math.max(pendingCount, 1) }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 flex-1 rounded-full',
                    i < pendingCount ? 'bg-risk-medium' : 'bg-secondary',
                  )}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleSync} disabled={pendingCount === 0 || syncing || !online} className="w-full">
            <RefreshCw className={cn('size-4', syncing && 'animate-spin')} />
            {syncing
              ? 'Syncing…'
              : !online
                ? 'Restore link to sync'
                : pendingCount === 0
                  ? 'Nothing to sync'
                  : `Sync ${pendingCount} event(s)`}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Toggle the link off, then generate events in the Threat Simulator — they queue here and flow
            into Alerts and Incidents once the link is restored and synced.
          </p>
        </div>

        <div className="flex flex-col rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              Sync activity log
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {log.length > 0 ? (
              <ul className="flex flex-col gap-1.5 font-mono text-xs">
                {log.map((line, i) => (
                  <li key={i} className="text-muted-foreground">
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center font-mono text-xs text-muted-foreground">
                No sync activity yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
