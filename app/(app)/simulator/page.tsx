'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ScanLine,
  Cpu,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ClipboardCheck,
  CloudOff,
  RotateCcw,
} from 'lucide-react'
import { useStore, type SimulationResult } from '@/lib/store'
import { SCENARIOS, LOCATION_NAMES } from '@/lib/mock-data'
import { PageHeader } from '@/components/page-header'
import { RiskGauge } from '@/components/risk-gauge'
import { RiskBadge } from '@/components/risk-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const PIPELINE = [
  'Ingesting simulated sensor stream',
  'Running on-device edge inference',
  'Classifying threat signature',
  'Computing weighted risk score',
  'Logging alert & incident record',
]

const ACTIONS: Record<string, string> = {
  NORMAL: 'No action required. Continue routine patrol.',
  LOW: 'Log and monitor. Acknowledge at next shift review.',
  MEDIUM: 'Dispatch nearest handheld unit for visual verification.',
  HIGH: 'Escalate to duty inspector. Isolate zone and verify on-site.',
  CRITICAL: 'Immediate escalation. Alert bomb-disposal / narcotics cell and cordon area.',
}

type Phase = 'idle' | 'processing' | 'done'

export default function SimulatorPage() {
  const { runSimulation, online } = useStore()
  const [scenarioId, setScenarioId] = useState('suspicious')
  const [device, setDevice] = useState('QD-02')
  const [location, setLocation] = useState('Platform 3')
  const [phase, setPhase] = useState<Phase>('idle')
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const analyze = useCallback(() => {
    clearTimers()
    setPhase('processing')
    setStep(0)
    setResult(null)

    PIPELINE.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setStep(i + 1), 550 * (i + 1)),
      )
    })
    timers.current.push(
      setTimeout(() => {
        const res = runSimulation(scenarioId, device, location)
        setResult(res)
        setPhase('done')
      }, 550 * (PIPELINE.length + 1)),
    )
  }, [runSimulation, scenarioId, device, location])

  const reset = () => {
    clearTimers()
    setPhase('idle')
    setStep(0)
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Threat Simulator"
        description="Generate a simulated detection event. The engine classifies the scenario, computes a risk score, and logs an alert and incident that propagate across the platform."
        icon={<ScanLine className="size-5" />}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Config */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Scenario Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Detection Scenario</Label>
              <div className="grid gap-2">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    disabled={phase === 'processing'}
                    onClick={() => setScenarioId(s.id)}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors disabled:opacity-60',
                      scenarioId === s.id
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-border bg-secondary/30 hover:bg-secondary/60',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
                        scenarioId === s.id ? 'border-primary bg-primary' : 'border-muted-foreground/40',
                      )}
                    >
                      {scenarioId === s.id && <span className="size-1.5 rounded-full bg-primary-foreground" />}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium">{s.label}</span>
                        <RiskBadge level={s.risk} />
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{s.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Source Device</Label>
                <Select value={device} onValueChange={setDevice} disabled={phase === 'processing'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['QD-01', 'QD-02', 'QD-03', 'QD-04', 'HH-01', 'HH-02', 'HH-03', 'HH-04'].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={location} onValueChange={setLocation} disabled={phase === 'processing'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_NAMES.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!online && (
              <div className="flex items-center gap-2 rounded-lg border border-risk-medium/30 bg-risk-medium/10 p-3 text-xs text-risk-medium">
                <CloudOff className="size-4 shrink-0" />
                Offline mode active — the generated event will be queued for sync.
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={analyze} disabled={phase === 'processing'} className="flex-1 gap-2">
                {phase === 'processing' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Cpu className="size-4" />
                    Run Analysis
                  </>
                )}
              </Button>
              {phase === 'done' && (
                <Button variant="outline" onClick={reset} className="gap-2">
                  <RotateCcw className="size-4" />
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Analysis Engine</CardTitle>
          </CardHeader>
          <CardContent>
            {phase === 'idle' && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-border bg-secondary/40 text-muted-foreground">
                  <ScanLine className="size-6" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure a scenario and run the analysis to generate a detection.
                </p>
              </div>
            )}

            {phase === 'processing' && (
              <div className="space-y-3 py-6">
                {PIPELINE.map((label, i) => {
                  const state = i < step ? 'done' : i === step ? 'active' : 'pending'
                  return (
                    <div
                      key={label}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                        state === 'done' && 'border-risk-low/30 bg-risk-low/5',
                        state === 'active' && 'border-primary/40 bg-primary/10',
                        state === 'pending' && 'border-border opacity-50',
                      )}
                    >
                      {state === 'done' ? (
                        <CheckCircle2 className="size-4 text-risk-low" />
                      ) : state === 'active' ? (
                        <Loader2 className="size-4 animate-spin text-primary" />
                      ) : (
                        <span className="size-4 rounded-full border border-muted-foreground/40" />
                      )}
                      <span className="font-mono text-xs">{label}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {phase === 'done' && result && (
              <div className="space-y-5">
                <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/20 py-5">
                  <RiskGauge score={result.riskScore} level={result.riskLevel} />
                  <RiskBadge level={result.riskLevel} className="text-sm" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Classification" value={result.classification} icon={<ShieldAlert className="size-4 text-risk-high" />} />
                  <Field label="Model Confidence" value={`${result.confidence}%`} icon={<Cpu className="size-4 text-primary" />} />
                  <Field label="Source Device" value={result.device} mono />
                  <Field label="Location" value={result.location} />
                  <Field label="Alert ID" value={result.alertId} mono />
                  <Field label="Incident ID" value={result.incidentId} mono />
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <ClipboardCheck className="size-4 text-primary" />
                    Recommended Action
                  </p>
                  <p className="text-sm leading-relaxed">{ACTIONS[result.riskLevel]}</p>
                </div>

                <div
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-3 text-xs',
                    result.queuedOffline
                      ? 'border-risk-medium/30 bg-risk-medium/10 text-risk-medium'
                      : 'border-risk-low/30 bg-risk-low/10 text-risk-low',
                  )}
                >
                  {result.queuedOffline ? <CloudOff className="size-4" /> : <CheckCircle2 className="size-4" />}
                  {result.queuedOffline
                    ? 'Event queued offline. Sync from the Offline Sync page to push to the control room.'
                    : 'Event logged to Alerts, Incidents, and Railway Map in real time.'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  icon,
  mono,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className={cn('mt-1 text-sm font-medium', mono && 'font-mono')}>{value}</p>
    </div>
  )
}
