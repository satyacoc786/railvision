'use client'

import { Battery, BatteryLow, Bot, Cpu, ScanLine } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatusDot } from '@/components/status-dot'
import { useStore } from '@/lib/store'
import type { Device } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function DevicesPage() {
  const { devices, toggleDeviceStatus } = useStore()
  const online = devices.filter((d) => d.status === 'ONLINE').length
  const quadrupeds = devices.filter((d) => d.type === 'Quadruped').length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Devices"
        icon={<Cpu className="size-5" />}
        description="Fleet of simulated autonomous quadruped units and handheld field scanners. Toggle a unit to demonstrate online/offline behavior across the platform. All telemetry is simulated."
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="rounded-md border border-border bg-card px-3 py-1.5 text-muted-foreground">
              {online}/{devices.length} online
            </span>
            <span className="rounded-md border border-border bg-card px-3 py-1.5 text-muted-foreground">
              {quadrupeds} quadruped · {devices.length - quadrupeds} handheld
            </span>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {devices.map((d) => (
          <DeviceCard key={d.id} device={d} onToggle={() => toggleDeviceStatus(d.id)} />
        ))}
      </div>
    </div>
  )
}

function DeviceCard({ device, onToggle }: { device: Device; onToggle: () => void }) {
  const isOnline = device.status === 'ONLINE'
  const lowBattery = device.battery <= 20
  const Icon = device.type === 'Quadruped' ? Bot : ScanLine
  const BatteryIcon = lowBattery ? BatteryLow : Battery

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-lg border bg-card p-5 transition-colors',
        isOnline ? 'border-border' : 'border-border/60 opacity-80',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-lg border',
              isOnline
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border bg-secondary text-muted-foreground',
            )}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <p className="font-mono text-sm font-semibold">{device.id}</p>
            <p className="text-xs text-muted-foreground">{device.type}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase text-muted-foreground">
          <StatusDot online={isOnline} />
          {device.status}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="font-mono text-[11px] uppercase text-muted-foreground">Location</dt>
          <dd className="mt-0.5">{device.location}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase text-muted-foreground">Activity</dt>
          <dd className="mt-0.5">{device.activity}</dd>
        </div>
        <div className="col-span-2">
          <dt className="font-mono text-[11px] uppercase text-muted-foreground">Last update</dt>
          <dd className="mt-0.5 font-mono text-xs">{device.lastUpdated}</dd>
        </div>
      </dl>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <BatteryIcon className={cn('size-4', lowBattery && 'text-risk-high')} />
            Battery
          </span>
          <span className={cn('font-mono tabular-nums', lowBattery ? 'text-risk-high' : 'text-foreground')}>
            {device.battery}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn('h-full rounded-full transition-all', lowBattery ? 'bg-risk-high' : 'bg-primary')}
            style={{ width: `${device.battery}%` }}
          />
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={onToggle} className="w-full">
        {isOnline ? 'Take offline' : 'Bring online'}
      </Button>
    </div>
  )
}
