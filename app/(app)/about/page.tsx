'use client'

import { AlertTriangle, Info, Radar, ShieldCheck, Train } from 'lucide-react'
import { PageHeader } from '@/components/page-header'

const CAPABILITIES = [
  {
    icon: Radar,
    title: 'Continuous monitoring',
    body: 'Autonomous and handheld units screen platforms, coaches, parcels, and yards around the clock.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk-scored alerts',
    body: 'Simulated sensor patterns are classified and scored, then routed to operators for review.',
  },
  {
    icon: Train,
    title: 'Railway-native',
    body: 'Zones, workflows, and terminology are modeled around real railway security operations.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="About RAILVISION"
        icon={<Info className="size-5" />}
        description="An AI-assisted railway security concept demonstrating how edge robotics and a unified command console could support railway protection teams."
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border bg-secondary/30 px-6 py-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Prototype concept
          </p>
          <h2 className="mt-3 max-w-2xl text-balance text-2xl font-semibold tracking-tight">
            A unified security picture for railway environments
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            RAILVISION brings field robotics, edge intelligence, and control-room oversight into a
            single interface. This prototype demonstrates the operator experience — from live
            monitoring and threat simulation to alert triage, incident tracking, and offline
            resilience.
          </p>
        </div>

        <div className="grid gap-px bg-border sm:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <c.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-risk-medium/30 bg-risk-medium/8 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-risk-medium" />
          <div>
            <h2 className="text-sm font-semibold text-risk-medium">Prototype disclaimer</h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              RAILVISION is a software demonstration. All devices, feeds, alerts, incidents, risk
              scores, and locations shown throughout the application are simulated for illustrative
              purposes only. Nothing in this interface represents live surveillance, real detections,
              or an operational security system. Classifications such as &ldquo;narcotics-related&rdquo;
              or &ldquo;explosive-related&rdquo; are fictional demo scenarios and must not be
              interpreted as real assessments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">How to explore this demo</h2>
          <ol className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            {[
              'Open the Threat Simulator and run a scenario to generate a live event.',
              'Watch it appear on the Dashboard, Alerts, and Railway Map.',
              'Toggle connectivity in Offline Sync, generate events, then sync them.',
              'Triage alerts and advance incidents through their lifecycle.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[11px] text-primary">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">At a glance</h2>
          <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
            {[
              { k: 'Monitored zones', v: '9' },
              { k: 'Device types', v: '2' },
              { k: 'Scenario types', v: '6' },
              { k: 'Risk levels', v: '5' },
            ].map((item) => (
              <div key={item.k} className="rounded-md border border-border bg-secondary/30 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {item.k}
                </dt>
                <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums text-primary">
                  {item.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
