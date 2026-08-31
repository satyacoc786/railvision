import { cn } from '@/lib/utils'

export function StatusDot({
  online,
  pulse = true,
  className,
}: {
  online: boolean
  pulse?: boolean
  className?: string
}) {
  return (
    <span className={cn('relative inline-flex size-2.5 items-center justify-center', className)}>
      {online && pulse && (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-risk-low/60" />
      )}
      <span
        className={cn(
          'relative inline-flex size-2.5 rounded-full',
          online ? 'bg-risk-low' : 'bg-muted-foreground/50',
        )}
      />
    </span>
  )
}
