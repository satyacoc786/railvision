import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PrototypeBadge({ className, label = 'SIMULATED DATA' }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-risk-medium/30 bg-risk-medium/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-risk-medium',
        className,
      )}
    >
      <FlaskConical className="size-3" />
      {label}
    </span>
  )
}
