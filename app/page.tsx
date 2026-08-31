'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Lock, ShieldCheck, TrainFront } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PrototypeBadge } from '@/components/prototype-badge'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const enter = () => {
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 400)
  }

  return (
    <div className="grid-lines relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <TrainFront className="size-7" />
          </div>
          <div className="mb-3 flex items-center gap-2">
            <h1 className="font-mono text-2xl font-bold tracking-tight">RAILVISION</h1>
            <PrototypeBadge label="Prototype" />
          </div>
          <p className="text-balance text-sm leading-relaxed text-muted-foreground">
            AI-Powered Railway Security Intelligence Platform for RPF Control Rooms
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            enter()
          }}
          className="rounded-xl border border-border bg-card p-6 shadow-xl"
        >
          <div className="mb-1 flex items-center gap-2 text-sm font-medium">
            <Lock className="size-4 text-primary" />
            Control Room Access
          </div>
          <p className="mb-5 text-xs text-muted-foreground">
            Demo access — any credentials will work.
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="officer-id">Officer ID</Label>
              <Input id="officer-id" placeholder="RPF-0042" defaultValue="RPF-0042" autoComplete="off" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Access Code</Label>
              <Input id="password" type="password" placeholder="••••••••" defaultValue="demo1234" />
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full gap-2" disabled={loading}>
            {loading ? 'Establishing secure link…' : 'Enter Control Room'}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Simulated environment · No real sensor data or live railway systems</span>
        </div>
      </div>
    </div>
  )
}
