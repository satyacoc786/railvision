import type { ReactNode } from 'react'
import { PrototypeBadge } from './prototype-badge'

export function PageHeader({
  title,
  description,
  icon,
  actions,
}: {
  title: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
            <PrototypeBadge />
          </div>
          {description && (
            <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
