import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/lib/types'

const RISK_STYLES: Record<RiskLevel, string> = {
  NORMAL: 'bg-primary/12 text-primary border-primary/30',
  LOW: 'bg-risk-low/12 text-risk-low border-risk-low/30',
  MEDIUM: 'bg-risk-medium/12 text-risk-medium border-risk-medium/30',
  HIGH: 'bg-risk-high/15 text-risk-high border-risk-high/35',
  CRITICAL: 'bg-risk-critical/15 text-risk-critical border-risk-critical/40',
}

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs font-medium tracking-wide',
        RISK_STYLES[level],
        className,
      )}
    >
      <span
        className={cn('size-1.5 rounded-full', {
          'bg-primary': level === 'NORMAL',
          'bg-risk-low': level === 'LOW',
          'bg-risk-medium': level === 'MEDIUM',
          'bg-risk-high': level === 'HIGH',
          'bg-risk-critical': level === 'CRITICAL',
        })}
      />
      {level}
    </span>
  )
}

export function riskColorVar(level: RiskLevel) {
  switch (level) {
    case 'NORMAL':
      return 'var(--primary)'
    case 'LOW':
      return 'var(--risk-low)'
    case 'MEDIUM':
      return 'var(--risk-medium)'
    case 'HIGH':
      return 'var(--risk-high)'
    case 'CRITICAL':
      return 'var(--risk-critical)'
  }
}
