'use client'

import { useMemo, useState } from 'react'
import { BellRing, Check, Search } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RiskBadge } from '@/components/risk-badge'
import { StatusBadge } from '@/components/status-badge'
import { useStore } from '@/lib/store'
import type { AlertStatus, RiskLevel } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const RISK_FILTERS: (RiskLevel | 'ALL')[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NORMAL']
const NEXT_STATUS: Record<AlertStatus, AlertStatus[]> = {
  ACTIVE: ['ACKNOWLEDGED', 'UNDER REVIEW', 'INVESTIGATING'],
  ACKNOWLEDGED: ['UNDER REVIEW', 'INVESTIGATING', 'RESOLVED'],
  'UNDER REVIEW': ['INVESTIGATING', 'RESOLVED'],
  INVESTIGATING: ['RESOLVED'],
  RESOLVED: [],
}

export default function AlertsPage() {
  const { alerts, updateAlertStatus } = useStore()
  const [query, setQuery] = useState('')
  const [risk, setRisk] = useState<RiskLevel | 'ALL'>('ALL')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const matchesRisk = risk === 'ALL' || a.riskLevel === risk
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        a.id.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.deviceId.toLowerCase().includes(q)
      return matchesRisk && matchesQuery
    })
  }, [alerts, risk, query])

  const selected = alerts.find((a) => a.id === selectedId) ?? null
  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Alerts"
        icon={<BellRing className="size-5" />}
        description="Simulated security alerts routed from field devices. Review, acknowledge, and update the status of each alert. All data shown is illustrative."
        actions={
          <span className="inline-flex items-center gap-2 rounded-md border border-risk-critical/30 bg-risk-critical/10 px-3 py-1.5 font-mono text-xs text-risk-critical">
            <span className="size-1.5 animate-pulse rounded-full bg-risk-critical" />
            {activeCount} ACTIVE
          </span>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search alerts, devices, locations…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {RISK_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRisk(r)}
              className={cn(
                'rounded-md border px-2.5 py-1 font-mono text-xs transition-colors',
                risk === r
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Alert ID</th>
                <th className="px-4 py-3 font-medium">Classification</th>
                <th className="px-4 py-3 font-medium">Risk</th>
                <th className="px-4 py-3 font-medium">Device</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedId(a.id)}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      {a.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-foreground">{a.type}</td>
                  <td className="px-4 py-3">
                    <RiskBadge level={a.riskLevel} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.deviceId}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.location}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.timestamp}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" onClick={() => setSelectedId(a.id)}>
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No alerts match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono text-sm text-primary">{selected.id}</span>
                  <RiskBadge level={selected.riskLevel} />
                </DialogTitle>
                <DialogDescription>{selected.type}</DialogDescription>
              </DialogHeader>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-border py-4 text-sm">
                <div>
                  <dt className="font-mono text-[11px] uppercase text-muted-foreground">Device</dt>
                  <dd className="mt-0.5 font-mono">{selected.deviceId}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase text-muted-foreground">Location</dt>
                  <dd className="mt-0.5">{selected.location}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase text-muted-foreground">Detected</dt>
                  <dd className="mt-0.5 font-mono">{selected.timestamp}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase text-muted-foreground">Confidence</dt>
                  <dd className="mt-0.5 font-mono">{selected.confidence}%</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-[11px] uppercase text-muted-foreground">Current status</dt>
                  <dd className="mt-1">
                    <StatusBadge status={selected.status} />
                  </dd>
                </div>
              </dl>

              <div>
                <p className="mb-2 font-mono text-[11px] uppercase text-muted-foreground">
                  Update status
                </p>
                {NEXT_STATUS[selected.status].length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {NEXT_STATUS[selected.status].map((s) => (
                      <Button
                        key={s}
                        variant="outline"
                        size="sm"
                        onClick={() => updateAlertStatus(selected.id, s)}
                      >
                        Mark {s}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="inline-flex items-center gap-1.5 text-sm text-risk-low">
                    <Check className="size-4" /> This alert is resolved.
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => setSelectedId(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
