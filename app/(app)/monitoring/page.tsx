'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { MonitorPlay, Radio, Maximize2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageHeader } from '@/components/page-header'
import { RiskBadge } from '@/components/risk-badge'
import { StatusDot } from '@/components/status-dot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RiskLevel } from '@/lib/types'

interface Feed {
  deviceId: string
  label: string
  location: string
  image: string
  status: string
  risk: RiskLevel
}

const FEEDS: Feed[] = [
  { deviceId: 'QD-02', label: 'Under-coach Inspection', location: 'Platform 3', image: '/feeds/under-coach.png', status: 'Scanning undercarriage', risk: 'NORMAL' },
  { deviceId: 'HH-01', label: 'Platform Overwatch', location: 'Station Entry', image: '/feeds/platform-cctv.png', status: 'Crowd monitoring', risk: 'LOW' },
  { deviceId: 'HH-03', label: 'Parcel Screening', location: 'Parcel Area', image: '/feeds/parcel-scan.png', status: 'Object detection active', risk: 'MEDIUM' },
  { deviceId: 'QD-01', label: 'Yard Patrol (Night Vision)', location: 'Railway Yard', image: '/feeds/yard-night.png', status: 'Perimeter sweep', risk: 'NORMAL' },
]

const LOG_TEMPLATES = [
  'Frame analyzed — no anomaly',
  'Object classified: baggage (benign)',
  'Motion detected in zone',
  'Thermal signature nominal',
  'Sensor calibration verified',
  'Passenger flow within limits',
  'Object classified: unattended (flagged)',
  'Edge inference complete · 42ms',
]

export default function MonitoringPage() {
  const { devices } = useStore()
  const [log, setLog] = useState<{ id: number; device: string; msg: string; time: string }[]>([])
  const idRef = useRef(0)

  useEffect(() => {
    const push = () => {
      const feed = FEEDS[Math.floor(Math.random() * FEEDS.length)]
      const msg = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
      idRef.current += 1
      setLog((prev) =>
        [
          { id: idRef.current, device: feed.deviceId, msg, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) },
          ...prev,
        ].slice(0, 40),
      )
    }
    push()
    const t = setInterval(push, 2600)
    return () => clearInterval(t)
  }, [])

  const isOnline = (id: string) => devices.find((d) => d.id === id)?.status === 'ONLINE'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Monitoring"
        description="Simulated real-time feeds from field devices. Camera imagery and detection logs are synthetic and for demonstration only."
        icon={<MonitorPlay className="size-5" />}
        actions={
          <span className="flex items-center gap-2 rounded-md border border-risk-critical/30 bg-risk-critical/10 px-2.5 py-1.5 font-mono text-xs font-medium text-risk-critical">
            <Radio className="size-3.5 animate-pulse" />
            LIVE
          </span>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
          {FEEDS.map((feed) => {
            const online = isOnline(feed.deviceId)
            return (
              <Card key={feed.deviceId} className="overflow-hidden p-0">
                <div className="relative aspect-video overflow-hidden bg-black">
                  <Image
                    src={feed.image || '/placeholder.svg'}
                    alt={`Simulated feed from ${feed.deviceId} at ${feed.location}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-90"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
                  {/* scanning line */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-[scan_3s_linear_infinite] bg-primary/70 shadow-[0_0_12px_2px_var(--primary)]" />

                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 font-mono text-[10px] font-medium text-risk-critical backdrop-blur-sm">
                      <span className="size-1.5 animate-pulse rounded-full bg-risk-critical" />
                      REC
                    </span>
                    <span className="rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white/90 backdrop-blur-sm">
                      {feed.deviceId}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3">
                    <RiskBadge level={feed.risk} />
                  </div>
                  <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-white">{feed.label}</p>
                      <p className="font-mono text-[11px] text-white/70">{feed.location}</p>
                    </div>
                    <span className="flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white/80 backdrop-blur-sm">
                      <StatusDot online={online} />
                      {online ? feed.status : 'SIGNAL LOST'}
                    </span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="flex max-h-[640px] flex-col xl:col-span-1">
          <CardHeader className="flex-row items-center justify-between border-b border-border">
            <CardTitle className="text-sm font-medium">Detection Log</CardTitle>
            <Maximize2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <ul className="divide-y divide-border/60">
              {log.map((entry) => (
                <li key={entry.id} className="flex items-start gap-3 px-4 py-2.5 text-xs">
                  <span className="font-mono text-muted-foreground">{entry.time}</span>
                  <span className="font-mono font-medium text-primary">{entry.device}</span>
                  <span
                    className={
                      entry.msg.includes('flagged')
                        ? 'text-risk-medium'
                        : 'text-muted-foreground'
                    }
                  >
                    {entry.msg}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
