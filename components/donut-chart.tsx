export interface DonutSegment {
  label: string
  value: number
  color: string
}

export function DonutChart({
  data,
  size = 168,
  thickness = 20,
  centerLabel,
  centerValue,
}: {
  data: DonutSegment[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerValue?: string | number
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={thickness}
          />
          {data.map((d) => {
            const fraction = d.value / total
            const dash = fraction * circumference
            const seg = (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            )
            offset += dash
            return seg
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold tabular-nums">{centerValue ?? total}</span>
          {centerLabel && (
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{centerLabel}</span>
          )}
        </div>
      </div>
      <ul className="flex w-full flex-col gap-2.5">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2.5 rounded-sm" style={{ background: d.color }} />
              {d.label}
            </span>
            <span className="font-mono font-medium tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
