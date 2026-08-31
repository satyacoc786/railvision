'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  INITIAL_ALERTS,
  INITIAL_DEVICES,
  INITIAL_INCIDENTS,
  SCENARIOS,
} from './mock-data'
import type {
  Alert,
  AlertStatus,
  Device,
  Incident,
  IncidentStatus,
  RiskLevel,
} from './types'

interface QueuedEvent {
  alert: Alert
  incident: Incident
}

export interface SimulationResult {
  scenario: string
  classification: string
  riskLevel: RiskLevel
  riskScore: number
  device: string
  location: string
  confidence: number
  alertId: string
  incidentId: string
  queuedOffline: boolean
  timestamp: string
}

interface StoreValue {
  devices: Device[]
  alerts: Alert[]
  incidents: Incident[]
  online: boolean
  pendingCount: number
  runSimulation: (scenarioId: string, deviceId: string, location: string) => SimulationResult
  updateAlertStatus: (id: string, status: AlertStatus) => void
  updateIncidentStatus: (id: string, status: IncidentStatus) => void
  setOnline: (value: boolean) => void
  syncNext: () => number
  toggleDeviceStatus: (id: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function nowTime() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false })
}

function makeQueued(n: number): QueuedEvent[] {
  const seeds = [
    { device: 'HH-02', location: 'Platform 2', classification: 'Suspicious Object Detected', risk: 'MEDIUM' as RiskLevel, score: 55 },
    { device: 'QD-04', location: 'Parcel Area', classification: 'Restricted Area Intrusion', risk: 'HIGH' as RiskLevel, score: 77 },
    { device: 'HH-02', location: 'Platform 2', classification: 'Routine Screening', risk: 'LOW' as RiskLevel, score: 19 },
    { device: 'QD-04', location: 'Parcel Area', classification: 'Normal Activity', risk: 'NORMAL' as RiskLevel, score: 7 },
  ]
  return seeds.slice(0, n).map((s, i) => ({
    alert: {
      id: `RV-2026-Q${i + 1}`,
      type: s.classification,
      riskLevel: s.risk,
      deviceId: s.device,
      location: s.location,
      timestamp: nowTime(),
      status: 'ACTIVE' as AlertStatus,
      confidence: s.score,
    },
    incident: {
      id: `RV-Q0${i + 1}`,
      location: s.location,
      device: s.device,
      classification: s.classification,
      riskLevel: s.risk,
      timestamp: nowTime(),
      status: 'OPEN' as IncidentStatus,
      confidence: s.score,
    },
  }))
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES)
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS)
  const [online, setOnlineState] = useState(true)
  const [queue, setQueue] = useState<QueuedEvent[]>(() => makeQueued(4))

  const alertSeq = useRef(100)
  const incidentSeq = useRef(100)

  // Subtle live simulation: jitter battery on online devices.
  useEffect(() => {
    const t = setInterval(() => {
      setDevices((prev) =>
        prev.map((d) =>
          d.status === 'ONLINE' && Math.random() > 0.55
            ? {
                ...d,
                battery: Math.max(8, Math.min(100, d.battery + (Math.random() > 0.5 ? -1 : 1))),
                lastUpdated: 'Just now',
              }
            : d,
        ),
      )
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const runSimulation = useCallback(
    (scenarioId: string, deviceId: string, location: string): SimulationResult => {
      const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]
      const jitter = Math.round((Math.random() - 0.5) * 8)
      const riskScore = Math.max(2, Math.min(99, scenario.baseScore + jitter))
      alertSeq.current += 1
      incidentSeq.current += 1
      const alertId = `RV-2026-${String(alertSeq.current).padStart(3, '0')}`
      const incidentId = `RV-${String(incidentSeq.current).padStart(3, '0')}`
      const ts = nowTime()

      const newAlert: Alert = {
        id: alertId,
        type: scenario.classification,
        riskLevel: scenario.risk,
        deviceId,
        location,
        timestamp: ts,
        status: 'ACTIVE',
        confidence: riskScore,
      }
      const newIncident: Incident = {
        id: incidentId,
        location,
        device: deviceId,
        classification: scenario.classification,
        riskLevel: scenario.risk,
        timestamp: ts,
        status: 'OPEN',
        confidence: riskScore,
      }

      if (online) {
        setAlerts((prev) => [newAlert, ...prev])
        setIncidents((prev) => [newIncident, ...prev])
      } else {
        setQueue((prev) => [...prev, { alert: newAlert, incident: newIncident }])
      }

      return {
        scenario: scenario.label,
        classification: scenario.classification,
        riskLevel: scenario.risk,
        riskScore,
        device: deviceId,
        location,
        confidence: riskScore,
        alertId,
        incidentId,
        queuedOffline: !online,
        timestamp: ts,
      }
    },
    [online],
  )

  const updateAlertStatus = useCallback((id: string, status: AlertStatus) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }, [])

  const updateIncidentStatus = useCallback((id: string, status: IncidentStatus) => {
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }, [])

  const setOnline = useCallback((value: boolean) => setOnlineState(value), [])

  const toggleDeviceStatus = useCallback((id: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE', lastUpdated: 'Just now' }
          : d,
      ),
    )
  }, [])

  // Flush a single queued event into the central store; returns remaining count.
  const syncNext = useCallback((): number => {
    let remaining = 0
    setQueue((prev) => {
      if (prev.length === 0) return prev
      const [first, ...rest] = prev
      setAlerts((a) => [first.alert, ...a])
      setIncidents((i) => [first.incident, ...i])
      remaining = rest.length
      return rest
    })
    return remaining
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      devices,
      alerts,
      incidents,
      online,
      pendingCount: queue.length,
      runSimulation,
      updateAlertStatus,
      updateIncidentStatus,
      setOnline,
      syncNext,
      toggleDeviceStatus,
    }),
    [devices, alerts, incidents, online, queue.length, runSimulation, updateAlertStatus, updateIncidentStatus, setOnline, syncNext, toggleDeviceStatus],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
