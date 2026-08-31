export function MiniBars({
  data,
  labels,
  color = 'var(--primary)',
  height = 120,
}: {
  data: number[]
  labels?: string[]
  color?: string
  height?: number
}) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((v, i) => {
        const h = Math.max(4, (v / max) * (height - 20))
        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1.5">
            <div
              className="w-full rounded-t-sm transition-all"
              style={{ height: h, background: color, opacity: 0.35 + (v / max) * 0.65 }}
              title={String(v)}
            />
            {labels && (
              <span className="text-[9px] tabular-nums text-muted-foreground">{labels[i]}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
