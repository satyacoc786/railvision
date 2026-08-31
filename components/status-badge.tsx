import { cn } from '@/lib/utils'

const STYLES: Record<string, string> = {
  ACTIVE: 'bg-risk-critical/12 text-risk-critical border-risk-critical/30',
  'UNDER REVIEW': 'bg-risk-medium/12 text-risk-medium border-risk-medium/30',
  INVESTIGATING: 'bg-risk-high/12 text-risk-high border-risk-high/30',
  ACKNOWLEDGED: 'bg-primary/12 text-primary border-primary/30',
  RESOLVED: 'bg-risk-low/12 text-risk-low border-risk-low/30',
  OPEN: 'bg-risk-medium/12 text-risk-medium border-risk-medium/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide',
        STYLES[status] ?? 'bg-secondary text-secondary-foreground border-border',
        className,
      )}
    >
      {status}
    </span>
  )
}
