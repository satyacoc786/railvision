'use client'

import { useMemo, useState } from 'react'
import { MapPinned } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RiskBadge } from '@/components/risk-badge'
import { StatusDot } from '@/components/status-dot'
import { useStore } from '@/lib/store'
import { RAILWAY_LOCATIONS } from '@/lib/mock-data'
import type { RiskLevel } from '@/lib/types'
import { cn } from '@/lib/utils'

const RISK_ORDER: Record<RiskLevel, number> = {
  NORMAL: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
}

const RISK_COLOR: Record<RiskLevel, string> = {
  NORMAL: 'var(--color-risk-normal)',
  LOW: 'var(--color-risk-low)',
  MEDIUM: 'var(--color-risk-medium)',
  HIGH: 'var(--color-risk-high)',
  CRITICAL: 'var(--color-risk-critical)',
}

export default function MapPage() {
  const { alerts, devices } = useStore()
  const [activeLocation, setActiveLocation] = useState<string | null>(null)

  // Aggregate the highest active risk per location from live alerts.
  const locationRisk = useMemo(() => {
    const map = new Map<string, RiskLevel>()
    for (const a of alerts) {
      if (a.status === 'RESOLVED') continue
      const current = map.get(a.location)
      if (!current || RISK_ORDER[a.riskLevel] > RISK_ORDER[current]) {
        map.set(a.location, a.riskLevel)
      }
    }
    return map
  }, [alerts])

  const devicesByLocation = useMemo(() => {
    const map = new Map<string, number>()
    for (const d of devices) {
      if (d.status !== 'ONLINE') continue
      map.set(d.location, (map.get(d.location) ?? 0) + 1)
    }
    return map
  }, [devices])

  const selected = RAILWAY_LOCATIONS.find((l) => l.name === activeLocation) ?? null
  const selectedAlerts = selected
    ? alerts.filter((a) => a.location === selected.name && a.status !== 'RESOLVED')
    : []
  const selectedDevices = selected ? devices.filter((d) => d.location === selected.name) : []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Railway Map"
        icon={<MapPinned className="size-5" />}
        description="Schematic overview of monitored railway zones. Markers reflect the highest active simulated risk at each location. Select a zone for details. This is an illustrative schematic, not a geographic map."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card">
          <div
            className="relative aspect-[16/10] w-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--color-border) 60%, transparent) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          >
            {/* schematic track lines */}
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
              <g stroke="var(--color-border)" strokeWidth="2" fill="none" opacity="0.7">
                <path d="M 12% 24% L 34% 16% L 58% 20% L 76% 30%" />
                <path d="M 12% 24% L 34% 34% L 58% 40% L 76% 30%" />
                <path d="M 58% 20% L 58% 40%" />
                <path d="M 22% 62% L 50% 74% L 82% 66%" />
                <path d="M 34% 34% L 22% 62%" strokeDasharray="4 4" />
                <path d="M 76% 30% L 82% 66%" strokeDasharray="4 4" />
              </g>
            </svg>

            {RAILWAY_LOCATIONS.map((loc) => {
              const risk = locationRisk.get(loc.name)
              const color = risk ? RISK_COLOR[risk] : 'var(--color-muted-foreground)'
              const isActive = activeLocation === loc.name
              const onlineDevices = devicesByLocation.get(loc.name) ?? 0
              return (
                <button
                  key={loc.name}
                  onClick={() => setActiveLocation(loc.name)}
                  className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  aria-label={loc.name}
                >
                  <span className="relative flex items-center justify-center">
                    {risk && (
                      <span
                        className="absolute inline-flex size-6 animate-ping rounded-full opacity-60"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    <span
                      className={cn(
                        'relative size-3.5 rounded-full border-2 border-background transition-transform',
                        isActive && 'scale-150',
                      )}
                      style={{ backgroundColor: color }}
                    />
                  </span>
                  <span
                    className={cn(
                      'whitespace-nowrap rounded border border-border bg-background/85 px-1.5 py-0.5 font-mono text-[10px] backdrop-blur transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
                    )}
                  >
                    {loc.name}
                    {onlineDevices > 0 && (
                      <span className="ml-1 text-primary">·{onlineDevices}</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-4 py-3">
            {(['NORMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: RISK_COLOR[r] }} />
                {r}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <span className="text-primary">·N</span> online devices
            </span>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5">
          {selected ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {selected.kind}
                </p>
                <h2 className="text-lg font-semibold">{selected.name}</h2>
              </div>

              <div>
                <p className="mb-2 font-mono text-[11px] uppercase text-muted-foreground">
                  Active alerts
                </p>
                {selectedAlerts.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {selectedAlerts.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm">{a.type}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {a.id} · {a.timestamp}
                          </p>
                        </div>
                        <RiskBadge level={a.riskLevel} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No active alerts at this zone.</p>
                )}
              </div>

              <div>
                <p className="mb-2 font-mono text-[11px] uppercase text-muted-foreground">Devices</p>
                {selectedDevices.length > 0 ? (
                  <ul className="flex flex-col gap-1.5">
                    {selectedDevices.map((d) => (
                      <li key={d.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <StatusDot online={d.status === 'ONLINE'} />
                          <span className="font-mono text-xs">{d.id}</span>
                          <span className="text-muted-foreground">{d.type}</span>
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">{d.battery}%</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No devices assigned to this zone.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
              <MapPinned className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Select a zone on the map to inspect active alerts and deployed devices.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
