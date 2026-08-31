'use client'

import {
  Bot,
  Cloud,
  Cpu,
  Database,
  MonitorSmartphone,
  Network,
  ScanLine,
  ShieldCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'

const LAYERS = [
  {
    id: 'edge',
    title: 'Edge Layer',
    subtitle: 'Field capture',
    color: 'var(--color-risk-medium)',
    nodes: [
      { icon: Bot, label: 'Quadruped Units', detail: 'Autonomous patrol & under-coach inspection' },
      { icon: ScanLine, label: 'Handheld Scanners', detail: 'Operator-carried field screening' },
    ],
  },
  {
    id: 'process',
    title: 'Processing Layer',
    subtitle: 'On-device intelligence',
    color: 'var(--color-primary)',
    nodes: [
      { icon: Cpu, label: 'Edge Inference', detail: 'Sensor fusion & risk classification' },
      { icon: Cloud, label: 'Store & Forward', detail: 'Offline buffering with sync-on-reconnect' },
    ],
  },
  {
    id: 'control',
    title: 'Control Layer',
    subtitle: 'Command room',
    color: 'var(--color-risk-high)',
    nodes: [
      { icon: Database, label: 'Event Registry', detail: 'Alerts & incident lifecycle' },
      { icon: ShieldCheck, label: 'Decision Support', detail: 'Risk scoring & response routing' },
    ],
  },
  {
    id: 'presentation',
    title: 'Presentation Layer',
    subtitle: 'Operator interface',
    color: 'var(--color-risk-low)',
    nodes: [
      { icon: MonitorSmartphone, label: 'Command Console', detail: 'Dashboard, map & live monitoring' },
    ],
  },
]

export default function ArchitecturePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="System Architecture"
        icon={<Network className="size-5" />}
        description="Conceptual data flow of the RAILVISION platform — from field capture through edge intelligence to the operator command console. This diagram illustrates the intended design of the prototype."
      />

      <div className="flex flex-col gap-3">
        {LAYERS.map((layer, i) => (
          <div key={layer.id} className="flex flex-col gap-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: layer.color }} />
                <div>
                  <h2 className="text-sm font-semibold">{layer.title}</h2>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {layer.subtitle}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {layer.nodes.map((node) => (
                  <div
                    key={node.label}
                    className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4"
                  >
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border"
                      style={{
                        borderColor: `color-mix(in oklch, ${layer.color} 40%, transparent)`,
                        backgroundColor: `color-mix(in oklch, ${layer.color} 12%, transparent)`,
                        color: layer.color,
                      }}
                    >
                      <node.icon className="size-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{node.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {node.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {i < LAYERS.length - 1 && (
              <div className="flex justify-center" aria-hidden>
                <div className="flex flex-col items-center">
                  <span className="h-4 w-px bg-border" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    data flow
                  </span>
                  <span className="h-4 w-px bg-border" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Design principles</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Resilient by design',
              body: 'Field devices operate independently and reconcile with the control room when connectivity returns.',
            },
            {
              title: 'Human-in-the-loop',
              body: 'Every simulated risk classification is surfaced for operator review — never actioned autonomously.',
            },
            {
              title: 'Auditable events',
              body: 'Alerts and incidents carry a traceable lifecycle from detection to resolution.',
            },
          ].map((p) => (
            <div key={p.title}>
              <p className="text-sm font-medium text-primary">{p.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
