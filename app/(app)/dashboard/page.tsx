'use client'

import Link from 'next/link'
import {
  Activity,
  ArrowUpRight,
  BellRing,
  CloudOff,
  Cpu,
  Gauge,
  TriangleAlert,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { deriveStats } from '@/lib/stats'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { DonutChart } from '@/components/donut-chart'
import { MiniBars } from '@/components/mini-bars'
import { RiskBadge, riskColorVar } from '@/components/risk-badge'
import { StatusDot } from '@/components/status-dot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const TREND = [12, 18, 9, 24, 31, 22, 40, 28, 52, 35, 61, 44]
const TREND_LABELS = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']

export default function DashboardPage() {
  const { devices, alerts, incidents, pendingCount } = useStore()
  const stats = deriveStats(devices, alerts, incidents)

  const donutData = stats.distribution
    .filter((d) => d.count > 0)
    .map((d) => ({ label: d.level, value: d.count, color: riskColorVar(d.level) }))

  const recentAlerts = alerts.slice(0, 5)
  const onlineDevices = devices.slice(0, 6)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Control Room Dashboard"
        description="Real-time overview of simulated railway security operations across the Central Zone. Metrics update as new detections are generated."
        icon={<Gauge className="size-5" />}
        actions={
          <Button asChild size="sm" className="gap-2">
            <Link href="/simulator">
              Run Threat Simulation
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          label="Active Devices"
          value={`${stats.activeDevices}/${stats.totalDevices}`}
          icon={<Cpu className="size-5" />}
          hint="Field units online"
        />
        <StatCard
          label="Alerts Today"
          value={stats.totalAlerts}
          icon={<BellRing className="size-5" />}
          hint={`${stats.activeAlerts} active`}
        />
        <StatCard
          label="High / Critical"
          value={stats.criticalThreats}
          icon={<TriangleAlert className="size-5" />}
          accent="high"
          hint="Priority threats"
        />
        <StatCard
          label="Avg Risk Score"
          value={stats.avgRisk}
          icon={<Activity className="size-5" />}
          accent={stats.avgRisk >= 70 ? 'high' : stats.avgRisk >= 40 ? 'medium' : 'low'}
          hint="Weighted index"
        />
        <StatCard
          label="Pending Sync"
          value={pendingCount}
          icon={<CloudOff className="size-5" />}
          accent={pendingCount > 0 ? 'medium' : 'low'}
          hint="Offline events"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Threat Classification</CardTitle>
          </CardHeader>
          <CardContent>
            {donutData.length > 0 ? (
              <DonutChart data={donutData} centerLabel="Alerts" centerValue={stats.totalAlerts} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No alerts yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Detection Activity · 24h</CardTitle>
            <span className="font-mono text-xs text-muted-foreground">events / 2h</span>
          </CardHeader>
          <CardContent>
            <MiniBars data={TREND} labels={TREND_LABELS} height={150} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
              <Link href="/alerts">
                View all
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentAlerts.map((a) => (
              <Link
                key={a.id}
                href="/alerts"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/60"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.type}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {a.id} · {a.location} · {a.deviceId}
                  </p>
                </div>
                <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                  {a.timestamp}
                </span>
                <RiskBadge level={a.riskLevel} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Device Status</CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
              <Link href="/devices">
                Manage
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {onlineDevices.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-2.5"
              >
                <StatusDot online={d.status === 'ONLINE'} pulse={d.status === 'ONLINE'} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs font-medium">{d.id}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{d.location}</p>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{d.battery}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
