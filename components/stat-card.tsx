import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

export function StatCard({
  label,
  value,
  icon,
  accent = 'default',
  hint,
}: {
  label: string
  value: ReactNode
  icon: ReactNode
  accent?: 'default' | 'low' | 'medium' | 'high' | 'critical'
  hint?: string
}) {
  const accentText = {
    default: 'text-primary',
    low: 'text-risk-low',
    medium: 'text-risk-medium',
    high: 'text-risk-high',
    critical: 'text-risk-critical',
  }[accent]

  return (
    <Card className="flex flex-row items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
        {hint && <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/50', accentText)}>
        {icon}
      </div>
    </Card>
  )
}
