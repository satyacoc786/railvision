import type { RiskLevel } from '@/lib/types'
import { riskColorVar } from './risk-badge'

export function RiskGauge({
  score,
  level,
  size = 200,
}: {
  score: number
  level: RiskLevel
  size?: number
}) {
  const thickness = 16
  const radius = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  // semicircle from 180deg to 0deg (top half arc)
  const circumference = Math.PI * radius
  const progress = Math.min(100, Math.max(0, score)) / 100
  const color = riskColorVar(level)

  const describeArc = (fraction: number) => {
    const startAngle = Math.PI
    const endAngle = Math.PI - fraction * Math.PI
    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)
    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)
    const largeArc = fraction > 0.5 ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 24 }}>
      <svg width={size} height={size / 2 + 24} viewBox={`0 0 ${size} ${size / 2 + 24}`}>
        <path
          d={describeArc(1)}
          fill="none"
          stroke="var(--border)"
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        <path
          d={describeArc(progress)}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span className="font-mono text-4xl font-bold tabular-nums" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Risk Score / 100
        </span>
      </div>
    </div>
  )
}
