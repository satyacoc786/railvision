'use client'

import { useMemo, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RiskBadge } from '@/components/risk-badge'
import { StatusBadge } from '@/components/status-badge'
import { useStore } from '@/lib/store'
import type { IncidentStatus } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STATUS_FILTERS: (IncidentStatus | 'ALL')[] = ['ALL', 'OPEN', 'INVESTIGATING', 'CLOSED']
const NEXT_STATUS: Record<IncidentStatus, IncidentStatus[]> = {
  OPEN: ['INVESTIGATING', 'CLOSED'],
  INVESTIGATING: ['CLOSED'],
  CLOSED: ['OPEN'],
}

export default function IncidentsPage() {
  const { incidents, updateIncidentStatus } = useStore()
  const [status, setStatus] = useState<IncidentStatus | 'ALL'>('ALL')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(
    () => (status === 'ALL' ? incidents : incidents.filter((i) => i.status === status)),
    [incidents, status],
  )

  const counts = useMemo(
    () => ({
      OPEN: incidents.filter((i) => i.status === 'OPEN').length,
      INVESTIGATING: incidents.filter((i) => i.status === 'INVESTIGATING').length,
      CLOSED: incidents.filter((i) => i.status === 'CLOSED').length,
    }),
    [incidents],
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Incidents"
        icon={<ClipboardList className="size-5" />}
        description="Incident register generated from simulated field events. Track investigation status across the response lifecycle. All records are illustrative."
      />

      <div className="grid grid-cols-3 gap-3">
        <SummaryTile label="Open" value={counts.OPEN} tone="medium" />
        <SummaryTile label="Investigating" value={counts.INVESTIGATING} tone="high" />
        <SummaryTile label="Closed" value={counts.CLOSED} tone="muted" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              'rounded-md border px-3 py-1.5 font-mono text-xs transition-colors',
              status === s
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.map((inc) => {
          const isOpen = expanded === inc.id
          return (
            <div key={inc.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <button
                onClick={() => setExpanded(isOpen ? null : inc.id)}
                className="flex w-full flex-col gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary">{inc.id}</span>
                  <span className="text-sm text-foreground">{inc.classification}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{inc.location}</span>
                  <RiskBadge level={inc.riskLevel} />
                  <StatusBadge status={inc.status} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border bg-secondary/20 px-4 py-4">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="font-mono text-[11px] uppercase text-muted-foreground">Device</dt>
                      <dd className="mt-0.5 font-mono">{inc.device}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase text-muted-foreground">Location</dt>
                      <dd className="mt-0.5">{inc.location}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase text-muted-foreground">Logged</dt>
                      <dd className="mt-0.5 font-mono">{inc.timestamp}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase text-muted-foreground">Confidence</dt>
                      <dd className="mt-0.5 font-mono">{inc.confidence}%</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] uppercase text-muted-foreground">
                      Update:
                    </span>
                    {NEXT_STATUS[inc.status].map((s) => (
                      <Button
                        key={s}
                        variant="outline"
                        size="sm"
                        onClick={() => updateIncidentStatus(inc.id, s)}
                      >
                        Mark {s}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
            No incidents with this status.
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'medium' | 'high' | 'muted'
}) {
  const toneClass =
    tone === 'medium'
      ? 'text-risk-medium'
      : tone === 'high'
        ? 'text-risk-high'
        : 'text-muted-foreground'
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn('mt-1 font-mono text-2xl font-semibold tabular-nums', toneClass)}>{value}</p>
    </div>
  )
}
